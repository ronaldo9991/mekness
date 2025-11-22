import StatCard from "@/components/StatCard";
import ActionCard from "@/components/ActionCard";
import DataTable from "@/components/DataTable";
import { Card } from "@/components/ui/card";
import LiveForexTicker from "@/components/LiveForexTicker";
import AccountTypesCard from "@/components/AccountTypesCard";
import { Wallet, TrendingUp, DollarSign, Activity, Plus, ArrowUpDown, Headphones, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { TradingAccount } from "@shared/schema";
import VerificationRequired from "@/components/VerificationRequired";

interface DashboardStats {
  balance: string;
  equity: string;
  margin: string;
  profitLoss: string;
  totalAccounts: number;
  openTrades: number;
  totalDeposits: number;
}

export default function DashboardHome() {
  const [, setLocation] = useLocation();

  // Check verification status - refetch more frequently to catch verification updates
  const { data: verificationStatus, isLoading: loadingVerification } = useQuery<{
    isVerified: boolean;
    verifiedCount: number;
    requiredCount: number;
    hasPending: boolean;
  }>({
    queryKey: ["/api/documents/verification-status"],
    refetchInterval: 10000, // Check every 10 seconds for faster updates after verification
    refetchIntervalInBackground: false, // Don't refetch when tab is hidden
  });

  // Fetch dashboard stats - optimized refetch interval
  const { data: stats, isLoading: loadingStats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000, // Increased to 30s (was 10s)
    refetchIntervalInBackground: false, // Don't refetch when tab is hidden
  });

  // Fetch trading accounts - optimized refetch interval
  const { data: tradingAccounts = [], isLoading: loadingAccounts } = useQuery<TradingAccount[]>({
    queryKey: ["/api/trading-accounts"],
    refetchInterval: 45000, // Increased to 45s (was 15s)
    refetchIntervalInBackground: false, // Don't refetch when tab is hidden
  });

  const columns = [
    { 
      key: "accountId", 
      label: "Account ID",
      render: (value: string) => (
        <span className="font-mono font-semibold">{value}</span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value: string) => (
        <Badge variant={value === "Live" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
    { 
      key: "group", 
      label: "Group",
      render: (value: string) => (
        <span className="font-semibold text-primary">{value}</span>
      ),
    },
    { 
      key: "balance", 
      label: "Balance",
      render: (value: string) => (
        <span className="font-semibold">${parseFloat(value || "0").toFixed(2)}</span>
      ),
    },
    { 
      key: "leverage", 
      label: "Leverage",
      render: (value: string) => (
        <span className="text-muted-foreground">{value}</span>
      ),
    },
    { 
      key: "createdAt", 
      label: "Created",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loadingStats || loadingAccounts || loadingVerification) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show verification required if documents not verified
  if (verificationStatus && !verificationStatus.isVerified) {
    return (
      <VerificationRequired
        verifiedCount={verificationStatus.verifiedCount}
        requiredCount={verificationStatus.requiredCount}
        hasPending={verificationStatus.hasPending}
      />
    );
  }

  const balance = parseFloat(stats?.balance || "0");
  const equity = parseFloat(stats?.equity || "0");
  const margin = parseFloat(stats?.margin || "0");
  const profitLoss = parseFloat(stats?.profitLoss || "0");

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl" />
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome back! Here's your real-time trading overview.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Balance" 
          value={`$${balance.toFixed(2)}`}
          icon={Wallet} 
          index={0} 
        />
        <StatCard 
          title="Equity" 
          value={`$${equity.toFixed(2)}`}
          icon={TrendingUp} 
          index={1} 
        />
        <StatCard 
          title="Margin" 
          value={`$${margin.toFixed(2)}`}
          icon={DollarSign} 
          index={2} 
        />
        <StatCard 
          title="P/L" 
          value={`${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)}`}
          icon={Activity} 
          index={3}
        />
      </div>

      {/* Live Forex Ticker */}
      <LiveForexTicker />

      {/* Quick Stats Row */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="relative p-6 border-primary/20 bg-gradient-to-br from-black/60 to-primary/5 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Total Accounts</div>
            <div className="text-3xl font-bold text-primary">{stats?.totalAccounts || 0}</div>
          </div>
        </Card>
        <Card className="relative p-6 border-primary/20 bg-gradient-to-br from-black/60 to-primary/5 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Open Trades</div>
            <div className="text-3xl font-bold text-green-400">{stats?.openTrades || 0}</div>
          </div>
        </Card>
        <Card className="relative p-6 border-primary/20 bg-gradient-to-br from-black/60 to-primary/5 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Completed Deposits</div>
            <div className="text-3xl font-bold text-primary">{stats?.totalDeposits || 0}</div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard
            title="Open Live Account"
            description="Start trading with real funds"
            icon={Plus}
            buttonText="Open Account"
            onClick={() => setLocation("/dashboard/accounts")}
          />
          <ActionCard
            title="Deposit Funds"
            description="Add money to your account"
            icon={ArrowUpDown}
            buttonText="Deposit Now"
            onClick={() => setLocation("/dashboard/deposit")}
          />
          <ActionCard
            title="View Trading History"
            description="Analyze your trading performance"
            icon={TrendingUp}
            buttonText="View History"
            onClick={() => setLocation("/dashboard/history")}
          />
          <ActionCard
            title="Contact Support"
            description="Get help from our team"
            icon={Headphones}
            buttonText="Get Support"
            onClick={() => setLocation("/dashboard/support")}
          />
        </div>
      </div>

      {/* Account Types */}
      {tradingAccounts.length === 0 && <AccountTypesCard />}

      <div>
        <h2 className="text-2xl font-bold text-primary uppercase tracking-wider mb-4">Your Trading Accounts</h2>
        {tradingAccounts.length > 0 ? (
          <Card className="border-primary/30 bg-black/80 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="p-6">
              <DataTable columns={columns} data={tradingAccounts} />
            </div>
          </Card>
        ) : (
          <Card className="relative p-12 text-center border-primary/30 bg-black/80 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="relative z-10">
              <p className="text-muted-foreground mb-6 text-lg">You don't have any trading accounts yet.</p>
              <ActionCard
                title="Create Your First Account"
                description="Get started with a demo or live account"
                icon={Plus}
                buttonText="Create Account"
                onClick={() => setLocation("/dashboard/accounts")}
              />
            </div>
          </Card>
        )}
      </div>

      <Card className="relative p-6 border-primary/30 bg-gradient-to-br from-black/80 to-primary/10 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-primary mb-2 uppercase tracking-wider">Need Assistance?</h3>
          <p className="text-muted-foreground mb-4">
            Our dedicated account managers are here to help you 24/7.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Headphones className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-primary font-bold">support@mekness.com</div>
              <div className="text-xs text-muted-foreground">Available 24/7</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
