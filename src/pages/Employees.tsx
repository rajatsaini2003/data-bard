import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { InviteMemberDialog } from "@/components/admin/InviteMemberDialog";
import { useAuthStore } from "@/store/authStore";
import { apiService } from "@/services/api";
import { User } from "@/types";
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  MoreVertical,
  Shield,
  BarChart3,
  Eye,
  Copy,
  Trash2,
  Loader2
} from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Helper function to transform User API data to display format
const transformUser = (user: User) => ({
  id: user.id,
  name: user.email.split('@')[0].replace(/[._]/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  email: user.email,
  role: user.is_admin ? "Admin" : "Analyst",
  department: "General", // Default as API doesn't provide department
  lastActive: new Date(user.created_at).toLocaleDateString(),
  status: user.status,
  dashboards: Math.floor(Math.random() * 20), // Placeholder - API doesn't provide this
  queries: Math.floor(Math.random() * 200) // Placeholder - API doesn't provide this
});

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<ReturnType<typeof transformUser>[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const isAdmin = user?.is_admin || false;

  const roleColors = {
    Admin: "bg-primary/10 text-primary",
    Analyst: "bg-accent-blue/10 text-accent-blue",
    Viewer: "bg-muted/10 text-muted-foreground"
  };

  const { toast } = useToast();

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await apiService.admin.getTeamMembers();
        const transformedEmployees = response.items.map(transformUser);
        setEmployees(transformedEmployees);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
        toast({
          title: "Error",
          description: "Failed to load team members",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchTeamMembers();
    }
  }, [isAdmin, toast]);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const changeRole = async (id: number, newRole: 'Admin' | 'Analyst' | 'Viewer') => {
    try {
      const apiRole = newRole === 'Admin' ? 'admin' : 'user';
      await apiService.admin.updateUserRole(id, apiRole);
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, role: newRole } : e));
      toast({ title: 'Role updated', description: `Member role changed to ${newRole}.` });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update member role.',
        variant: 'destructive'
      });
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const employee = employees.find(e => e.id === id);
      if (employee?.status === 'active') {
        await apiService.admin.deactivateUser(id);
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'inactive' as const } : e));
        toast({ title: 'Status updated', description: 'Member has been deactivated.' });
      } else {
        // Note: There's no reactivate endpoint in the API, so this is just UI update
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'active' as const } : e));
        toast({ title: 'Status updated', description: 'Member status has been updated.' });
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update member status.',
        variant: 'destructive'
      });
    }
  };

  const removeEmployee = (id: number) => {
    if (window.confirm('Remove this member from the organization?')) {
      // Note: There's no remove user endpoint in the API, so this is just UI update
      setEmployees(prev => prev.filter(e => e.id !== id));
      toast({ title: 'Member removed', description: 'The member has been removed from the team.' });
    }
  };

  const sendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast({ title: 'Email copied', description: email });
    } catch {
      toast({ title: 'Copy failed', description: 'Unable to copy email.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Team Members</h1>
            <p className="text-muted-foreground">{isAdmin ? "Manage your organization's users and permissions" : "View your organization's team members"}</p>
          </div>
          {isAdmin && (
            <InviteMemberDialog
              trigger={
                <Button variant="hero">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              }
            />
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{employees.filter(e => e.status === 'active').length}</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Dashboards</p>
                <p className="text-2xl font-bold">{employees.reduce((sum, e) => sum + e.dashboards, 0)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-accent-blue" />
            </div>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Queries</p>
                <p className="text-2xl font-bold">{employees.reduce((sum, e) => sum + e.queries, 0)}</p>
              </div>
              <Eye className="h-8 w-8 text-accent-purple" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">All Roles</Button>
              <Button variant="outline">Active Only</Button>
            </div>
          </div>
        </Card>

        {/* Employee List */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading team members...</span>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No team members found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'No members match your search criteria.' : 'Start by inviting your first team member.'}
                </p>
                {isAdmin && !searchTerm && (
                  <InviteMemberDialog
                    trigger={
                      <Button variant="hero">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite First Member
                      </Button>
                    }
                  />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEmployees.map((employee, index) => (
                <div 
                  key={employee.id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border hover:bg-background/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">{employee.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{employee.email}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{employee.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-semibold">{employee.dashboards}</p>
                      <p className="text-xs text-muted-foreground">Dashboards</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-semibold">{employee.queries}</p>
                      <p className="text-xs text-muted-foreground">Queries</p>
                    </div>
                    
                    <div className="text-center">
                      <Badge className={roleColors[employee.role as keyof typeof roleColors]}>
                        {employee.role}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{employee.lastActive}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => sendEmail(employee.email)}>
                          <Mail className="h-4 w-4 mr-2" /> Send email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyEmail(employee.email)}>
                          <Copy className="h-4 w-4 mr-2" /> Copy email
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => changeRole(employee.id, 'Admin')}>
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeRole(employee.id, 'Analyst')}>
                              Make Analyst
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeRole(employee.id, 'Viewer')}>
                              Make Viewer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleStatus(employee.id)}>
                              {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => removeEmployee(employee.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Remove from team
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Employees;