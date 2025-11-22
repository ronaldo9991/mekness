import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { Users, FileText, Wallet, DollarSign, Shield, Loader2, UserPlus, Check, X, Copy, Key } from "lucide-react";
import CountryMultiSelect from "@/components/CountryMultiSelect";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AdminUser, User, Document } from "@shared/schema";

interface AdminStats {
  totalUsers: number;
  pendingDocuments: number;
  totalTradingAccounts: number;
  totalDeposits: number;
  activeAdmins: number;
}

interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  createdAt: Date;
}

interface SuperAdminDashboardProps {
  admin: AdminUser;
}

export default function SuperAdminDashboard({ admin }: SuperAdminDashboardProps) {
  const { toast } = useToast();
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    role: "normal_admin" as "super_admin" | "middle_admin" | "normal_admin",
    countries: [] as string[],
  });
  
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    username: string;
    password: string;
    email: string;
    fullName: string;
    role: string;
    countries?: string[];
  } | null>(null);

  const { data: stats, isLoading: loadingStats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const { data: documents = [], isLoading: loadingDocuments } = useQuery<Document[]>({
    queryKey: ["/api/admin/documents"],
    refetchInterval: 15000, // Refetch every 15 seconds for pending documents
  });

  const { data: activityLogs = [], isLoading: loadingLogs } = useQuery<ActivityLog[]>({
    queryKey: ["/api/admin/activity-logs"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: admins = [], isLoading: loadingAdmins } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/admins"],
    refetchInterval: 60000, // Refetch every 60 seconds
  });
  
  // Fetch country assignments for middle admins
  const { data: allCountryAssignments = [] } = useQuery<Array<{ adminId: string; country: string }>>({
    queryKey: ["/api/admin/all-country-assignments"],
    enabled: admins.length > 0,
  });

  const toggleUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest("PATCH", `/api/admin/users/${userId}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/admins", data);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admins"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setCreateAdminOpen(false);
      
      // Store credentials to show in dialog
      setCreatedCredentials({
        username: response.credentials.username,
        password: response.credentials.password,
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        role: newAdmin.role,
        countries: response.countries?.map((c: any) => c.country) || [],
      });
      
      setCredentialsDialogOpen(true);
      
      // Reset form
      setNewAdmin({
        username: "",
        password: "",
        email: "",
        fullName: "",
        role: "normal_admin",
        countries: [],
      });
      
      toast({
        title: "Admin Created",
        description: "New admin has been created successfully",
      });
    },
    onError: (error: any) => {
      console.error("Admin creation error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create admin";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const approveDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return await apiRequest("PATCH", `/api/admin/documents/${documentId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Document Approved",
        description: "Document has been approved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve document",
        variant: "destructive",
      });
    },
  });

  const rejectDocumentMutation = useMutation({
    mutationFn: async ({ documentId, reason }: { documentId: string; reason: string }) => {
      return await apiRequest("PATCH", `/api/admin/documents/${documentId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setRejectDialogOpen(false);
      setSelectedDocument(null);
      setRejectionReason("");
      toast({
        title: "Document Rejected",
        description: "Document has been rejected",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject document",
        variant: "destructive",
      });
    },
  });

  const handleCreateAdmin = () => {
    if (!newAdmin.username || !newAdmin.password || !newAdmin.email || !newAdmin.fullName) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate countries for middle_admin
    if (newAdmin.role === "middle_admin" && newAdmin.countries.length === 0) {
      toast({
        title: "Missing Countries",
        description: "At least one country is required for middle admin",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare data for API
    const dataToSend: any = {
      username: newAdmin.username,
      password: newAdmin.password,
      email: newAdmin.email,
      fullName: newAdmin.fullName,
      role: newAdmin.role,
    };
    
    // Add countries only for middle_admin
    if (newAdmin.role === "middle_admin") {
      dataToSend.countries = newAdmin.countries;
    }
    
    createAdminMutation.mutate(dataToSend);
  };
  
  const copyCredentials = () => {
    if (!createdCredentials) return;
    const text = `Username: ${createdCredentials.username}\nPassword: ${createdCredentials.password}\nEmail: ${createdCredentials.email}\nFull Name: ${createdCredentials.fullName}\nRole: ${createdCredentials.role}${createdCredentials.countries && createdCredentials.countries.length > 0 ? `\nCountries: ${createdCredentials.countries.join(", ")}` : ""}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Credentials copied to clipboard",
    });
  };

  const handleRejectDocument = () => {
    if (!selectedDocument || !rejectionReason) {
      toast({
        title: "Missing Reason",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }
    rejectDocumentMutation.mutate({
      documentId: selectedDocument.id,
      reason: rejectionReason,
    });
  };

  const userColumns = [
    {
      key: "username",
      label: "Username",
      render: (value: string) => <span className="font-semibold">{value}</span>,
    },
    { key: "email", label: "Email" },
    { key: "fullName", label: "Full Name" },
    { key: "country", label: "Country" },
    {
      key: "verified",
      label: "Verified",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "enabled",
      label: "Status",
      render: (value: boolean, row: User) => (
        <Button
          variant={value ? "default" : "outline"}
          size="sm"
          onClick={() => toggleUserMutation.mutate(row.id)}
          disabled={toggleUserMutation.isPending}
          data-testid={`button-toggle-user-${row.id}`}
        >
          {value ? "Enabled" : "Disabled"}
        </Button>
      ),
    },
  ];

  const documentColumns = [
    {
      key: "userId",
      label: "User",
      render: (_: string, row: Document) => {
        const user = users.find((u) => u.id === row.userId);
        return <span className="font-semibold">{user?.username || "Unknown"}</span>;
      },
    },
    { key: "type", label: "Document Type" },
    {
      key: "uploadedAt",
      label: "Upload Date",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: "fileUrl",
      label: "File",
      render: (value: string) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          data-testid="link-document-preview"
        >
          View
        </a>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_: string, row: Document) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => approveDocumentMutation.mutate(row.id)}
            disabled={approveDocumentMutation.isPending}
            data-testid={`button-approve-${row.id}`}
          >
            <Check className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedDocument(row);
              setRejectDialogOpen(true);
            }}
            data-testid={`button-reject-${row.id}`}
          >
            <X className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const activityColumns = [
    {
      key: "adminName",
      label: "Admin",
      render: (value: string) => <span className="font-semibold">{value}</span>,
    },
    { key: "action", label: "Action" },
    { key: "targetType", label: "Target Type" },
    { key: "details", label: "Details" },
    {
      key: "createdAt",
      label: "Time",
      render: (value: Date) => new Date(value).toLocaleString(),
    },
  ];

  if (loadingStats || loadingUsers || loadingDocuments || loadingLogs) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingDocuments = documents.filter((doc) => doc.status === "Pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Complete system overview and control</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers.toString() || "0"}
          icon={Users}
          index={0}
        />
        <StatCard
          title="Pending Documents"
          value={stats?.pendingDocuments.toString() || "0"}
          icon={FileText}
          index={1}
        />
        <StatCard
          title="Trading Accounts"
          value={stats?.totalTradingAccounts.toString() || "0"}
          icon={Wallet}
          index={2}
        />
        <StatCard
          title="Total Deposits"
          value={stats?.totalDeposits.toString() || "0"}
          icon={DollarSign}
          index={3}
        />
        <StatCard
          title="Active Admins"
          value={stats?.activeAdmins.toString() || "0"}
          icon={Shield}
          index={4}
        />
      </div>

      {/* Admin Management Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Admin Management</h2>
          <Dialog open={createAdminOpen} onOpenChange={setCreateAdminOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-admin">
                <UserPlus className="w-4 h-4 mr-2" />
                Create New Admin
              </Button>
            </DialogTrigger>
          <DialogContent className="glass-card max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
              <DialogDescription>
                Add a new administrator to the system. Fill in all required fields.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateAdmin();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  data-testid="input-new-admin-username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  data-testid="input-new-admin-password"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  data-testid="input-new-admin-email"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={newAdmin.fullName}
                  onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                  data-testid="input-new-admin-fullname"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newAdmin.role} 
                  onValueChange={(value: "super_admin" | "middle_admin" | "normal_admin") => {
                    setNewAdmin({ 
                      ...newAdmin, 
                      role: value,
                      countries: value === "middle_admin" ? newAdmin.countries : [] // Clear countries if not middle_admin
                    });
                  }}
                >
                  <SelectTrigger id="role" data-testid="select-new-admin-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="middle_admin">Middle Admin</SelectItem>
                    <SelectItem value="normal_admin">Normal Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newAdmin.role === "middle_admin" && (
                <div>
                  <CountryMultiSelect
                    value={newAdmin.countries}
                    onChange={(countries) => setNewAdmin({ ...newAdmin, countries })}
                    label="Assigned Countries"
                    required
                    placeholder="Select countries for this middle admin..."
                  />
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full"
                disabled={createAdminMutation.isPending}
                data-testid="button-submit-create-admin"
              >
                {createAdminMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Admin"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
        
        {loadingAdmins ? (
          <Card className="p-12 text-center border-card-border">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading admins...</p>
          </Card>
        ) : (
          <DataTable 
            columns={[
              {
                key: "username",
                label: "Username",
                render: (value: string) => <span className="font-semibold">{value}</span>,
              },
              { key: "email", label: "Email" },
              { key: "fullName", label: "Full Name" },
              {
                key: "role",
                label: "Role",
                render: (value: string) => {
                  const roleColors: Record<string, string> = {
                    super_admin: "bg-red-500/20 text-red-400 border-red-500/30",
                    middle_admin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                    normal_admin: "bg-green-500/20 text-green-400 border-green-500/30",
                  };
                  return (
                    <Badge variant="outline" className={roleColors[value] || ""}>
                      {value.replace("_", " ").toUpperCase()}
                    </Badge>
                  );
                },
              },
              {
                key: "countries",
                label: "Countries",
                render: (_: any, row: AdminUser) => {
                  if (row.role !== "middle_admin") return <span className="text-muted-foreground">-</span>;
                  const adminCountries = allCountryAssignments
                    .filter(a => a.adminId === row.id)
                    .map(a => a.country);
                  if (adminCountries.length === 0) return <span className="text-muted-foreground">No countries assigned</span>;
                  return (
                    <div className="flex flex-wrap gap-1">
                      {adminCountries.slice(0, 3).map(country => (
                        <Badge key={country} variant="secondary" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                      {adminCountries.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{adminCountries.length - 3} more
                        </Badge>
                      )}
                    </div>
                  );
                },
              },
              {
                key: "enabled",
                label: "Status",
                render: (value: boolean) => (
                  <Badge variant={value ? "default" : "secondary"}>
                    {value ? "Enabled" : "Disabled"}
                  </Badge>
                ),
              },
            ]} 
            data={admins} 
          />
        )}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>
      </div>

      <DataTable columns={userColumns} data={users} />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Pending Documents</h2>
        {pendingDocuments.length > 0 ? (
          <DataTable columns={documentColumns} data={pendingDocuments} />
        ) : (
          <Card className="p-12 text-center border-card-border">
            <p className="text-muted-foreground">No pending documents</p>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        {activityLogs.length > 0 ? (
          <DataTable columns={activityColumns} data={activityLogs} />
        ) : (
          <Card className="p-12 text-center border-card-border">
            <p className="text-muted-foreground">No recent activity</p>
          </Card>
        )}
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
                data-testid="textarea-rejection-reason"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectDialogOpen(false);
                  setSelectedDocument(null);
                  setRejectionReason("");
                }}
                className="flex-1"
                data-testid="button-cancel-reject"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectDocument}
                className="flex-1"
                disabled={rejectDocumentMutation.isPending}
                data-testid="button-confirm-reject"
              >
                {rejectDocumentMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject Document"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credentials Display Dialog */}
      <Dialog open={credentialsDialogOpen} onOpenChange={setCredentialsDialogOpen}>
        <DialogContent className="glass-card max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Admin Created Successfully
            </DialogTitle>
            <DialogDescription>
              Save these credentials - the password will not be shown again
            </DialogDescription>
          </DialogHeader>
          {createdCredentials && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Username:</span>
                  <span className="font-mono text-sm font-semibold">{createdCredentials.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Password:</span>
                  <span className="font-mono text-sm font-semibold text-primary">{createdCredentials.password}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Email:</span>
                  <span className="text-sm">{createdCredentials.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Full Name:</span>
                  <span className="text-sm">{createdCredentials.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Role:</span>
                  <Badge variant="secondary" className="capitalize">
                    {createdCredentials.role.replace("_", " ")}
                  </Badge>
                </div>
                {createdCredentials.countries && createdCredentials.countries.length > 0 && (
                  <div className="pt-2 border-t border-primary/20">
                    <span className="text-sm font-medium text-muted-foreground block mb-2">Assigned Countries:</span>
                    <div className="flex flex-wrap gap-2">
                      {createdCredentials.countries.map((country) => (
                        <Badge key={country} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={copyCredentials}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Credentials
                </Button>
                <Button
                  onClick={() => {
                    setCredentialsDialogOpen(false);
                    setCreatedCredentials(null);
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
              
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-xs text-yellow-400 flex items-start gap-2">
                  <X className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Important: Save these credentials securely. The password cannot be retrieved later.</span>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
