import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import { Loader2, Wallet } from "lucide-react";
import type { IbCbWallet, User } from "@shared/schema";

export default function AdminIBCBWallets() {
  const { data: wallets = [], isLoading } = useQuery<IbCbWallet[]>({
    queryKey: ["/api/admin/ib-cb-wallets"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.fullName || user?.username || "Unknown";
  };

  const columns = [
    {
      key: "id",
      label: "Wallet ID",
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
      key: "walletType",
      label: "Type",
      render: (value: string) => {
        const colors = {
          IB: "bg-blue-500",
          CB: "bg-purple-500",
        };
        const labels = {
          IB: "Introducing Broker",
          CB: "Corporate Broker",
        };
        return (
          <Badge className={`${colors[value as keyof typeof colors] || "bg-gray-500"} text-white`}>
            {labels[value as keyof typeof labels] || value}
          </Badge>
        );
      },
    },
    {
      key: "balance",
      label: "Balance",
      render: (value: string) => (
        <span className="font-semibold text-green-600">
          ${parseFloat(value || "0").toFixed(2)}
        </span>
      ),
    },
    {
      key: "commissionRate",
      label: "Commission Rate",
      render: (value: string) => (
        <span className="text-sm">
          {(parseFloat(value || "0") * 100).toFixed(2)}%
        </span>
      ),
    },
    {
      key: "totalCommission",
      label: "Total Commission",
      render: (value: string) => (
        <span className="font-semibold">
          ${parseFloat(value || "0").toFixed(2)}
        </span>
      ),
    },
    {
      key: "enabled",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "destructive"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: Date) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
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

  // Calculate stats
  const ibWallets = wallets.filter((w) => w.walletType === "IB");
  const cbWallets = wallets.filter((w) => w.walletType === "CB");
  const totalCommissions = wallets.reduce((sum, w) => sum + parseFloat(w.totalCommission || "0"), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">IB CB Wallets</h1>
          <p className="text-muted-foreground">Introducing Broker and Corporate Broker wallets</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 border-card-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">IB Wallets</p>
              <p className="text-3xl font-bold">{ibWallets.length}</p>
            </div>
            <Badge className="bg-blue-500 text-white text-lg px-4 py-2">
              IB
            </Badge>
          </div>
        </Card>

        <Card className="p-6 border-card-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">CB Wallets</p>
              <p className="text-3xl font-bold">{cbWallets.length}</p>
            </div>
            <Badge className="bg-purple-500 text-white text-lg px-4 py-2">
              CB
            </Badge>
          </div>
        </Card>

        <Card className="p-6 border-card-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Commissions</p>
              <p className="text-3xl font-bold text-green-600">
                ${totalCommissions.toFixed(2)}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Wallets Table */}
      <Card className="border-card-border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All IB & CB Wallets</h2>
        </div>
        {wallets.length > 0 ? (
          <DataTable columns={columns} data={wallets} />
        ) : (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No wallets found</p>
          </div>
        )}
      </Card>
    </div>
  );
}

