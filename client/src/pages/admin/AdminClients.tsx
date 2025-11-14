import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import { Search, Mail, UserPlus, Loader2, Copy, Check } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function AdminClients() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fundsDialogOpen, setFundsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isAddingFunds, setIsAddingFunds] = useState(true);

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
      render: (value: string | null) => (
        <Badge variant="outline">{value || "N/A"}</Badge>
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
    </div>
  );
}

