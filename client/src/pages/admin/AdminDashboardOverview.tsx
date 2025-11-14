import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { Users, FileText, Wallet, TrendingUp, Loader2 } from "lucide-react";
import type { AdminUser } from "@shared/schema";

interface AdminDashboardOverviewProps {
  admin: AdminUser;
}

interface DashboardStats {
  totalLiveTradingMembers: number;
  totalUsers: number;
  pendingDocuments: number;
  verifiedDocuments: number;
  totalTradingAccounts: number;
  liveAccounts: number;
  demoAccounts: number;
  totalDeposits: number;
  pendingDeposits: number;
  completedDeposits: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  totalDepositAmount: string;
  totalWithdrawalAmount: string;
}

export default function AdminDashboardOverview({ admin }: AdminDashboardOverviewProps) {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 30000, // Real-time updates every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {admin.fullName}. Here's your system overview.
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Live Trading Members"
          value={stats?.totalLiveTradingMembers?.toString() || stats?.liveAccounts?.toString() || "0"}
          icon={Users}
          index={0}
          description="Active live trading accounts"
        />
        <StatCard
          title="Pending Documents"
          value={stats?.pendingDocuments?.toString() || "0"}
          icon={FileText}
          index={1}
          description="Awaiting verification"
        />
        <StatCard
          title="Verified Documents"
          value={stats?.verifiedDocuments?.toString() || "0"}
          icon={FileText}
          index={2}
          description="Successfully verified"
        />
        <StatCard
          title="Total Trading Accounts"
          value={stats?.totalTradingAccounts?.toString() || "0"}
          icon={Wallet}
          index={3}
          description="All account types"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-card-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6 border-card-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Deposits</p>
              <p className="text-2xl font-bold">{stats?.pendingDeposits || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6 border-card-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Withdrawals</p>
              <p className="text-2xl font-bold">{stats?.pendingWithdrawals || 0}</p>
            </div>
            <Wallet className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-card-border">
          <h3 className="text-lg font-semibold mb-4">Deposits Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-semibold">${stats?.totalDepositAmount || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed:</span>
              <span className="font-semibold text-green-600">{stats?.completedDeposits || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending:</span>
              <span className="font-semibold text-yellow-600">{stats?.pendingDeposits || 0}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-card-border">
          <h3 className="text-lg font-semibold mb-4">Withdrawals Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-semibold">${stats?.totalWithdrawalAmount || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending:</span>
              <span className="font-semibold text-yellow-600">{stats?.pendingWithdrawals || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Requests:</span>
              <span className="font-semibold">{stats?.totalWithdrawals || 0}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

