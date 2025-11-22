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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, Eye, Loader2, Download } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Withdrawal, User, TradingAccount } from "@shared/schema";

export default function AdminWithdrawals() {
  const { toast } = useToast();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: withdrawals = [], isLoading } = useQuery<Withdrawal[]>({
    queryKey: ["/api/admin/withdrawals"],
    refetchInterval: 15000, // Real-time updates every 15 seconds
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: accounts = [] } = useQuery<TradingAccount[]>({
    queryKey: ["/api/admin/trading-accounts"],
  });

  const approveWithdrawalMutation = useMutation({
    mutationFn: async (withdrawalId: string) => {
      return await apiRequest("PATCH", `/api/admin/withdrawals/${withdrawalId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setActionDialogOpen(false);
      setSelectedWithdrawal(null);
      toast({
        title: "Withdrawal Approved",
        description: "Withdrawal has been approved and processed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve withdrawal",
        variant: "destructive",
      });
    },
  });

  const rejectWithdrawalMutation = useMutation({
    mutationFn: async ({ withdrawalId, reason }: { withdrawalId: string; reason: string }) => {
      return await apiRequest("PATCH", `/api/admin/withdrawals/${withdrawalId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setActionDialogOpen(false);
      setSelectedWithdrawal(null);
      setRejectionReason("");
      toast({
        title: "Withdrawal Rejected",
        description: "Withdrawal has been rejected",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject withdrawal",
        variant: "destructive",
      });
    },
  });

  const downloadFullListMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/admin/withdrawals/export");
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `withdrawals-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Withdrawals list is being downloaded",
      });
    },
  });

  const handleReject = () => {
    if (!selectedWithdrawal || !rejectionReason) {
      toast({
        title: "Missing Reason",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }
    rejectWithdrawalMutation.mutate({
      withdrawalId: selectedWithdrawal.id,
      reason: rejectionReason,
    });
  };

  const pendingWithdrawals = withdrawals.filter((w) => w.status === "Pending");

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
      label: "Client",
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
      key: "method",
      label: "Method",
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: string) => (
        <span className="font-semibold text-red-600">
          ${parseFloat(value || "0").toFixed(2)}
        </span>
      ),
    },
    {
      key: "bankName",
      label: "Bank Details",
      render: (_: string | null, row: Withdrawal) => (
        <div className="text-sm">
          {row.bankName && <div>{row.bankName}</div>}
          {row.accountNumber && <div className="text-muted-foreground">****{row.accountNumber.slice(-4)}</div>}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Request Date",
      render: (value: Date) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
          Pending: "secondary",
          Processing: "default",
          Completed: "default",
          Rejected: "destructive",
        };
        return <Badge variant={variants[value] || "secondary"}>{value}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Action",
      render: (_: any, row: Withdrawal) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedWithdrawal(row);
              setActionDialogOpen(true);
            }}
          >
            <Eye className="w-3 h-3 mr-1" />
            Process
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
          <h1 className="text-3xl font-bold mb-2">Withdrawals</h1>
          <p className="text-muted-foreground">
            Manage pending withdrawal requests
          </p>
        </div>
      </div>

      {/* Withdrawals Table */}
      <Card className="border-card-border">
        {pendingWithdrawals.length > 0 ? (
          <DataTable columns={columns} data={pendingWithdrawals} />
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
          {downloadFullListMutation.isPending ? "Downloading..." : "Download Full List of Withdrawals"}
        </Button>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Withdrawal</DialogTitle>
            <DialogDescription>
              Approve or reject this withdrawal request
            </DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div>
                <Label>Client</Label>
                <p className="font-semibold">{getUserName(selectedWithdrawal.userId)}</p>
              </div>
              <div>
                <Label>Account</Label>
                <p className="font-mono">{getAccountId(selectedWithdrawal.accountId)}</p>
              </div>
              <div>
                <Label>Amount</Label>
                <p className="font-semibold text-lg">${parseFloat(selectedWithdrawal.amount).toFixed(2)}</p>
              </div>
              <div>
                <Label>Method</Label>
                <p>{selectedWithdrawal.method}</p>
              </div>
              {selectedWithdrawal.bankName && (
                <div>
                  <Label>Bank Details</Label>
                  <div className="text-sm">
                    <p>{selectedWithdrawal.bankName}</p>
                    <p>{selectedWithdrawal.accountHolderName}</p>
                    <p>Account: {selectedWithdrawal.accountNumber}</p>
                    {selectedWithdrawal.swiftCode && <p>SWIFT: {selectedWithdrawal.swiftCode}</p>}
                  </div>
                </div>
              )}
              <div>
                <Label>Rejection Reason (if rejecting)</Label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActionDialogOpen(false);
                    setSelectedWithdrawal(null);
                    setRejectionReason("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={rejectWithdrawalMutation.isPending || !rejectionReason}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button
                  onClick={() => approveWithdrawalMutation.mutate(selectedWithdrawal.id)}
                  disabled={approveWithdrawalMutation.isPending}
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
  );
}

