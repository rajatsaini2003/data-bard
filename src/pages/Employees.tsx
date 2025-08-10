import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { InviteMemberDialog } from "@/components/admin/InviteMemberDialog";
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  MoreVertical,
  Shield,
  BarChart3,
  Eye
} from "lucide-react";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const employees = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      role: "Admin",
      department: "Data Science",
      lastActive: "2 hours ago",
      status: "active",
      dashboards: 12,
      queries: 156
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      email: "m.rodriguez@company.com",
      role: "Analyst",
      department: "Marketing",
      lastActive: "1 day ago",
      status: "active",
      dashboards: 8,
      queries: 89
    },
    {
      id: 3,
      name: "Emily Watson",
      email: "e.watson@company.com",
      role: "Viewer",
      department: "Sales",
      lastActive: "3 days ago",
      status: "inactive",
      dashboards: 3,
      queries: 23
    },
    {
      id: 4,
      name: "David Kim",
      email: "d.kim@company.com",
      role: "Analyst",
      department: "Finance",
      lastActive: "5 hours ago",
      status: "active",
      dashboards: 15,
      queries: 201
    }
  ];

  const roleColors = {
    Admin: "bg-primary/10 text-primary",
    Analyst: "bg-accent-blue/10 text-accent-blue",
    Viewer: "bg-muted/10 text-muted-foreground"
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Team Members</h1>
            <p className="text-muted-foreground">Manage your organization's users and permissions</p>
          </div>
<InviteMemberDialog
            trigger={
              <Button variant="hero">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            }
          />
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

                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Employees;