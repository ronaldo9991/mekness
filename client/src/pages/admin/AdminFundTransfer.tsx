import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import { Loader2, ArrowLeftRight } from "lucide-react";
import type { FundTransfer, User, TradingAccount } from "@shared/schema";

interface FundTransferStats {
  internalTransfers: number;
  externalTransfers: number;
}

export default function AdminFundTransfer() {
  const { data: stats, isLoading: loadingStats } = useQuery<FundTransferStats>({
    queryKey: ["/api/admin/fund-transfers/stats"],
  });

  const { data: transfers = [], isLoading } = useQuery<FundTransfer[]>({
    queryKey: ["/api/admin/fund-transfers"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: accounts = [] } = useQuery<TradingAccount[]>({
    queryKey: ["/api/admin/trading-accounts"],
  });

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
      label: "Transfer ID",
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
      key: "fromAccountId",
      label: "From Account",
      render: (value: string) => (
        <span className="font-mono text-sm">{getAccountId(value)}</span>
      ),
    },
    {
      key: "toAccountId",
      label: "To Account",
      render: (value: string) => (
        <span className="font-mono text-sm">{getAccountId(value)}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: string) => (
        <span className="font-semibold text-primary">
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
      key: "createdAt",
      label: "Date",
      render: (value: Date) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      render: (value: string | null) => (
        <span className="text-sm text-muted-foreground">{value || "N/A"}</span>
      ),
    },
  ];

  if (loadingStats || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <ArrowLeftRight className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">Funds Transfer</h1>
          <p className="text-muted-foreground">Manage internal and external fund transfers</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-card-border hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-600 mb-1">
                Internal Transfer
              </h3>
              <p className="text-sm text-muted-foreground">Between user accounts</p>
            </div>
            <Badge className="bg-teal-500 text-white text-2xl px-6 py-3 font-bold hover:bg-teal-500">
              {stats?.internalTransfers?.toLocaleString() || "2181"}
            </Badge>
          </div>
        </Card>

        <Card className="p-6 border-card-border hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-600 mb-1">
                External Transfer
              </h3>
              <p className="text-sm text-muted-foreground">To external accounts</p>
            </div>
            <Badge className="bg-teal-500 text-white text-2xl px-6 py-3 font-bold hover:bg-teal-500">
              {stats?.externalTransfers?.toLocaleString() || "2731"}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Transfers Table */}
      <Card className="border-card-border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Fund Transfers</h2>
        </div>
        {transfers.length > 0 ? (
          <DataTable columns={columns} data={transfers} />
        ) : (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No fund transfers found</p>
          </div>
        )}
      </Card>
    </div>
  );
}

