import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardTable } from '@/types';

interface DynamicTableProps {
  table: DashboardTable;
  data: Record<string, unknown>[];
  className?: string;
}

const DynamicTable = ({ table, data, className }: DynamicTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = table.pagination?.pageSize || 10;
  const searchEnabled = table.search?.enabled ?? true;
  const paginationEnabled = table.pagination?.enabled ?? true;

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchEnabled) return data;

    return data.filter(row =>
      Object.values(row).some(value =>
        value !== null && 
        value !== undefined && 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchEnabled]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Convert to comparable types
      const aComparable = typeof aValue === 'number' ? aValue : String(aValue).toLowerCase();
      const bComparable = typeof bValue === 'number' ? bValue : String(bValue).toLowerCase();

      if (aComparable < bComparable) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aComparable > bComparable) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!paginationEnabled) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, paginationEnabled]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnField: string) => {
    const column = table.columns.find(col => col.field === columnField);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.key === columnField) {
        return {
          key: columnField,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key: columnField, direction: 'asc' };
    });
  };

  const formatCellValue = (value: unknown, column: { type?: string; format?: string }) => {
    if (value === null || value === undefined) return '-';

    switch (column.type || column.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(value) || 0);
      
      case 'percentage':
        return `${Number(value || 0).toFixed(1)}%`;
      
      case 'number':
        return Number(value || 0).toLocaleString();
      
      case 'date':
        try {
          return new Date(String(value)).toLocaleDateString();
        } catch {
          return String(value);
        }
      
      default:
        return String(value);
    }
  };

  const getSortIcon = (columnField: string) => {
    if (!sortConfig || sortConfig.key !== columnField) {
      return <ChevronUp className="h-4 w-4 opacity-30" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-primary" />
      : <ChevronDown className="h-4 w-4 text-primary" />;
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <Card className={className}>
      {table.title && (
        <CardHeader>
          <CardTitle>{table.title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {/* Search */}
        {searchEnabled && (
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={table.search?.placeholder || "Search table..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">
              {sortedData.length} of {data.length} records
            </Badge>
          </div>
        )}

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {table.columns.map((column) => (
                  <TableHead
                    key={column.field}
                    className={column.sortable ? 'cursor-pointer select-none hover:bg-muted/50' : ''}
                    onClick={() => handleSort(column.field)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header || column.label || column.field}
                      {column.sortable && getSortIcon(column.field)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={table.columns.length} className="text-center py-8 text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <TableRow key={index}>
                    {table.columns.map((column) => (
                      <TableCell key={column.field}>
                        {formatCellValue(row[column.field], column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {paginationEnabled && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
              {sortedData.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(totalPages)}
                      className="w-8 h-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicTable;