import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import { Search, Mail, UserPlus, Loader2, Copy, Check, Eye, Edit, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@shared/schema";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Belgium", "Switzerland", "Austria", "Sweden", "Norway", "Denmark", "Finland",
  "Poland", "Portugal", "Greece", "Ireland", "Czech Republic", "Romania", "Hungary", "Bulgaria",
  "Croatia", "Slovakia", "Slovenia", "Estonia", "Latvia", "Lithuania", "Luxembourg", "Malta",
  "Cyprus", "Japan", "China", "India", "South Korea", "Singapore", "Malaysia", "Thailand",
  "Indonesia", "Philippines", "Vietnam", "Hong Kong", "Taiwan", "New Zealand", "South Africa",
  "Egypt", "Nigeria", "Kenya", "Morocco", "Ghana", "United Arab Emirates", "Saudi Arabia",
  "Israel", "Turkey", "Brazil", "Mexico", "Argentina", "Chile", "Colombia", "Peru", "Venezuela",
  "Russia", "Ukraine", "Kazakhstan", "Belarus", "Georgia", "Armenia", "Azerbaijan", "Other"
];

export default function AdminClients() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fundsDialogOpen, setFundsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isAddingFunds, setIsAddingFunds] = useState(true);
  const [viewEditDialogOpen, setViewEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
  });

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    refetchInterval: 60000, // Real-time updates every 60 seconds
  });

  const sendActivationLinkMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest("POST", `/api/admin/users/${userId}/send-activation-link`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Account activation link sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send activation link",
        variant: "destructive",
      });
    },
  });

  const impersonateMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest("POST", `/api/admin/users/${userId}/impersonate`);
    },
    onSuccess: () => {
      toast({
        title: "Impersonation Started",
        description: "You are now viewing as this user",
      });
      // Redirect to user dashboard
      window.location.href = "/dashboard";
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to impersonate user",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
      return await apiRequest("PATCH", `/api/admin/users/${userId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setViewEditDialogOpen(false);
      setEditingUser(null);
      toast({
        title: "Success",
        description: "User details updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const openViewEditDialog = (user: User) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      country: user.country || "",
      city: user.city || "",
      address: user.address || "",
      zipCode: user.zipCode || "",
    });
    setViewEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    updateUserMutation.mutate({
      userId: editingUser.id,
      updates: editForm,
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(search) ||
      user.fullName?.toLowerCase().includes(search) ||
      user.username?.toLowerCase().includes(search) ||
      user.referralId?.toLowerCase().includes(search) ||
      user.country?.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">{value.slice(0, 8)}...</span>
          <button
            onClick={() => copyToClipboard(value, value)}
            className="p-1 hover:bg-accent rounded"
          >
            {copiedId === value ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: "fullName",
      label: "Name",
      render: (value: string, row: User) => (
        <div>
          <div className="font-semibold">{value || row.username}</div>
          {row.email && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {row.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "referralId",
      label: "Referral ID",
      render: (value: string | null) => (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <span className="font-mono text-sm">{value}</span>
              <button
                onClick={() => copyToClipboard(value, `ref-${value}`)}
                className="p-1 hover:bg-accent rounded"
              >
                {copiedId === `ref-${value}` ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </>
          ) : (
            <span className="text-muted-foreground text-sm">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone No",
      render: (value: string | null) => (
        <span className="text-sm">{value || "N/A"}</span>
      ),
    },
    {
      key: "country",
      label: "Country",
      render: (_: any, row: User) => (
        <Badge variant="outline" className={row.country ? "bg-primary/10 text-primary border-primary/30" : ""}>
          {row.country || "N/A"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Member Since",
      render: (value: Date) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: "enabled",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "destructive"}>
          {value ? "Active" : "Disabled"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: User) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openViewEditDialog(row)}
          >
            <Eye className="w-3 h-3 mr-1" />
            View/Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => sendActivationLinkMutation.mutate(row.id)}
            disabled={sendActivationLinkMutation.isPending}
          >
            <Mail className="w-3 h-3 mr-1" />
            Send Link
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => impersonateMutation.mutate(row.id)}
            disabled={impersonateMutation.isPending}
          >
            <UserPlus className="w-3 h-3 mr-1" />
            Impersonate
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clients</h1>
          <p className="text-muted-foreground">Manage all registered clients</p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4 border-card-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, referral ID, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Clients Table */}
      <Card className="border-card-border">
        <DataTable columns={columns} data={filteredUsers} />
      </Card>

      {/* View/Edit User Dialog */}
      <Dialog open={viewEditDialogOpen} onOpenChange={setViewEditDialogOpen}>
        <DialogContent className="bg-black border-primary/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">View & Edit Client Details</DialogTitle>
            <DialogDescription>
              View and update client information
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input value={editingUser.id} disabled className="font-mono text-xs" />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={editingUser.username} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select
                    value={editForm.country || ""}
                    onValueChange={(value) => setEditForm({ ...editForm, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input
                    value={editForm.zipCode}
                    onChange={(e) => setEditForm({ ...editForm, zipCode: e.target.value })}
                    placeholder="10001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Street address"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Referral ID</Label>
                  <Input value={editingUser.referralId || "N/A"} disabled className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <Input 
                    value={editingUser.createdAt ? new Date(editingUser.createdAt).toLocaleDateString() : "N/A"} 
                    disabled 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Input 
                    value={editingUser.enabled ? "Active" : "Disabled"} 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Verified</Label>
                  <Input 
                    value={editingUser.verified ? "Yes" : "No"} 
                    disabled 
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateUserMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {updateUserMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

