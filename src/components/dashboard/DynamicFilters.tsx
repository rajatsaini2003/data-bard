import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, X, Filter, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardFilter } from '@/types';

interface DynamicFiltersProps {
  filters: DashboardFilter[];
  data: Record<string, unknown>[];
  onFiltersChange: (filteredData: Record<string, unknown>[]) => void;
  className?: string;
}

interface FilterState {
  [key: string]: unknown;
}

const DynamicFilters = ({ filters, data, onFiltersChange, className }: DynamicFiltersProps) => {
  const [filterState, setFilterState] = useState<FilterState>({});
  const [dateRange, setDateRange] = useState<{ [key: string]: { from?: Date; to?: Date } }>({});

  // Apply filters to data
  const filteredData = useMemo(() => {
    let result = [...data];

    filters.forEach((filter) => {
      const filterValue = filterState[filter.field];
      const dateRangeValue = dateRange[filter.field];

      if (!filterValue && !dateRangeValue) return;

      switch (filter.type) {
        case 'dropdown':
          if (filterValue && filterValue !== 'all') {
            result = result.filter(item => item[filter.field] === filterValue);
          }
          break;

        case 'multi-select':
          if (Array.isArray(filterValue) && filterValue.length > 0) {
            result = result.filter(item => filterValue.includes(item[filter.field]));
          }
          break;

        case 'search':
          if (typeof filterValue === 'string' && filterValue.trim()) {
            const searchTerm = filterValue.toLowerCase();
            result = result.filter(item => {
              const fieldValue = item[filter.field];
              return fieldValue && 
                     typeof fieldValue === 'string' && 
                     fieldValue.toLowerCase().includes(searchTerm);
            });
          }
          break;

        case 'date-range':
          if (dateRangeValue?.from) {
            result = result.filter(item => {
              const itemDate = new Date(item[filter.field] as string);
              const fromDate = dateRangeValue.from!;
              const toDate = dateRangeValue.to || new Date();
              
              return itemDate >= fromDate && itemDate <= toDate;
            });
          }
          break;
      }
    });

    return result;
  }, [data, filterState, dateRange, filters]);

  // Apply filtered data whenever it changes
  useMemo(() => {
    onFiltersChange(filteredData);
  }, [filteredData, onFiltersChange]);

  const updateFilter = (field: string, value: unknown) => {
    setFilterState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateDateRange = (field: string, range: { from?: Date; to?: Date }) => {
    setDateRange(prev => ({
      ...prev,
      [field]: range
    }));
  };

  const clearFilter = (field: string, type: string) => {
    if (type === 'date-range') {
      setDateRange(prev => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    } else {
      setFilterState(prev => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    }
  };

  const clearAllFilters = () => {
    setFilterState({});
    setDateRange({});
  };

  const getUniqueValues = (field: string): string[] => {
    const values = data.map(item => item[field])
      .filter(value => value !== null && value !== undefined)
      .map(value => String(value));
    return Array.from(new Set(values)).sort();
  };

  const hasActiveFilters = Object.keys(filterState).length > 0 || Object.keys(dateRange).length > 0;

  const renderFilter = (filter: DashboardFilter) => {
    const filterValue = filterState[filter.field];
    const dateRangeValue = dateRange[filter.field];

    switch (filter.type) {
      case 'dropdown': {
        const dropdownOptions = filter.options || getUniqueValues(filter.field);
        return (
          <div key={filter.field} className="space-y-2">
            <Label htmlFor={filter.field} className="text-sm font-medium">
              {filter.label || filter.field}
            </Label>
            <div className="flex gap-2">
              <Select
                value={filterValue as string || 'all'}
                onValueChange={(value) => updateFilter(filter.field, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {dropdownOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filterValue && filterValue !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter(filter.field, filter.type)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      }

      case 'multi-select': {
        const multiSelectOptions = filter.options || getUniqueValues(filter.field);
        const selectedValues = Array.isArray(filterValue) ? filterValue : [];
        
        return (
          <div key={filter.field} className="space-y-2">
            <Label className="text-sm font-medium">
              {filter.label || filter.field}
            </Label>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {multiSelectOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${filter.field}-${option}`}
                      checked={selectedValues.includes(option)}
                      onCheckedChange={(checked) => {
                        const newValues = checked
                          ? [...selectedValues, option]
                          : selectedValues.filter(v => v !== option);
                        updateFilter(filter.field, newValues);
                      }}
                    />
                    <Label
                      htmlFor={`${filter.field}-${option}`}
                      className="text-sm font-normal truncate"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedValues.map((value) => (
                    <Badge key={value} variant="secondary" className="text-xs">
                      {value}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => {
                          const newValues = selectedValues.filter(v => v !== value);
                          updateFilter(filter.field, newValues);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'search': {
        return (
          <div key={filter.field} className="space-y-2">
            <Label htmlFor={filter.field} className="text-sm font-medium">
              {filter.label || filter.field}
            </Label>
            <div className="flex gap-2">
              <Input
                id={filter.field}
                type="text"
                placeholder={`Search ${filter.label || filter.field}...`}
                value={filterValue as string || ''}
                onChange={(e) => updateFilter(filter.field, e.target.value)}
              />
              {filterValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter(filter.field, filter.type)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      }

      case 'date-range': {
        return (
          <div key={filter.field} className="space-y-2">
            <Label className="text-sm font-medium">
              {filter.label || filter.field}
            </Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRangeValue?.from ? (
                      dateRangeValue.to ? (
                        <>
                          {format(dateRangeValue.from, "LLL dd, y")} -{" "}
                          {format(dateRangeValue.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRangeValue.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRangeValue?.from}
                    selected={dateRangeValue?.from ? {
                      from: dateRangeValue.from,
                      to: dateRangeValue.to
                    } : undefined}
                    onSelect={(range) => updateDateRange(filter.field, range || {})}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              {dateRangeValue?.from && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter(filter.field, filter.type)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (filters.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map(renderFilter)}
        </div>
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredData.length} of {data.length} records
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicFilters;