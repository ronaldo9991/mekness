import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Check, X, Eye, Loader2, DollarSign } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Deposit, User, TradingAccount } from "@shared/schema";

export default function AdminDeposits() {
  const { toast } = useToast();
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const { data: deposits = [], isLoading: loadingDeposits } = useQuery<Deposit[]>({
    queryKey: ["/api/admin/deposits"],
    refetchInterval: 15000, // Real-time updates every 15 seconds for pending deposits
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: accounts = [] } = useQuery<TradingAccount[]>({
    queryKey: ["/api/admin/trading-accounts"],
  });

  const approveDepositMutation = useMutation({
    mutationFn: async ({ depositId, amount }: { depositId: string; amount?: string }) => {
      return await apiRequest("PATCH", `/api/admin/deposits/${depositId}/approve`, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setActionDialogOpen(false);
      setSelectedDeposit(null);
      setDepositAmount("");
      toast({
        title: "Deposit Approved",
        description: "Deposit has been approved and credited to account",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve deposit",
        variant: "destructive",
      });
    },
  });

  const rejectDepositMutation = useMutation({
    mutationFn: async (depositId: string) => {
      return await apiRequest("PATCH", `/api/admin/deposits/${depositId}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Deposit Rejected",
        description: "Deposit has been rejected",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject deposit",
        variant: "destructive",
      });
    },
  });

  const downloadFullListMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/admin/deposits/export");
      // Create download link
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `deposits-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Deposits list is being downloaded",
      });
    },
  });

  const handleApprove = () => {
    if (!selectedDeposit) return;
    approveDepositMutation.mutate({
      depositId: selectedDeposit.id,
      amount: depositAmount || undefined,
    });
  };

  const pendingDeposits = deposits.filter((d) => d.status === "Pending");

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.fullName || user?.username || "Unknown";
  };

  const getAccountId = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    return account?.accountId || accountId;
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value: string) => (
        <span className="font-mono text-xs">{value.slice(0, 8)}...</span>
      ),
    },
    {
      key: "userId",
      label: "Clients",
      render: (value: string) => (
        <span className="font-semibold">{getUserName(value)}</span>
      ),
    },
    {
      key: "accountId",
      label: "Account",
      render: (value: string) => (
        <span className="font-mono text-sm">{getAccountId(value)}</span>
      ),
    },
    {
      key: "depositDate",
      label: "Deposit Date",
      render: (value: Date | null, row: Deposit) => {
        const date = value || row.createdAt;
        return <span className="text-sm">{new Date(date).toLocaleDateString()}</span>;
      },
    },
    {
      key: "merchant",
      label: "Merchant",
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: "verificationFile",
      label: "Verification File",
      render: (value: string | null) => {
        if (!value) return <span className="text-muted-foreground text-sm">N/A</span>;
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            View
          </a>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: string) => (
        <span className="font-semibold text-green-600">
          ${parseFloat(value || "0").toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
          Pending: "secondary",
          Completed: "default",
          Failed: "destructive",
        };
        return <Badge variant={variants[value] || "secondary"}>{value}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Action",
      render: (_: any, row: Deposit) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedDeposit(row);
              setDepositAmount(row.amount);
              setActionDialogOpen(true);
            }}
          >
            <DollarSign className="w-3 h-3 mr-1" />
            Process
          </Button>
        </div>
      ),
    },
  ];

  if (loadingDeposits) {
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
          <h1 className="text-3xl font-bold mb-2">Deposits</h1>
          <p className="text-muted-foreground">
            Following is the list of pending Deposit:
          </p>
        </div>
        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              Deposit Amount in Trading Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Deposit</DialogTitle>
              <DialogDescription>
                Approve or reject this deposit request
              </DialogDescription>
            </DialogHeader>
            {selectedDeposit && (
              <div className="space-y-4">
                <div>
                  <Label>Client</Label>
                  <p className="font-semibold">{getUserName(selectedDeposit.userId)}</p>
                </div>
                <div>
                  <Label>Account</Label>
                  <p className="font-mono">{getAccountId(selectedDeposit.accountId)}</p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActionDialogOpen(false);
                      setSelectedDeposit(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => rejectDepositMutation.mutate(selectedDeposit.id)}
                    disabled={rejectDepositMutation.isPending}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={approveDepositMutation.isPending}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Deposits Table */}
      <Card className="border-card-border">
        {pendingDeposits.length > 0 ? (
          <DataTable columns={columns} data={pendingDeposits} />
        ) : (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No Records Found</p>
          </div>
        )}
      </Card>

      {/* Download Full List */}
      <div className="flex justify-center">
        <Button
          size="lg"
          variant="outline"
          className="bg-green-600 hover:bg-green-700 text-white border-0"
          onClick={() => downloadFullListMutation.mutate()}
          disabled={downloadFullListMutation.isPending}
        >
          <Download className="w-4 h-4 mr-2" />
          {downloadFullListMutation.isPending ? "Downloading..." : "Download Full List of Deposits"}
        </Button>
      </div>
    </div>
  );
}

