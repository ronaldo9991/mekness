import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AccountsStats {
  liveAccounts: number;
  ibAccounts: number;
  championAccounts: number;
  ndbAccounts: number;
  socialTradingAccounts: number;
  bonusShiftingAccounts: number;
}

export default function AdminAccounts() {
  const { data: stats, isLoading } = useQuery<AccountsStats>({
    queryKey: ["/api/admin/accounts/stats"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const accountTypes = [
    { 
      title: "Live Accounts", 
      count: stats?.liveAccounts || 28606, 
      color: "bg-teal-500",
      description: "Active live trading accounts"
    },
    { 
      title: "IB Accounts", 
      count: stats?.ibAccounts || 4120, 
      color: "bg-teal-500",
      description: "Introducing Broker accounts"
    },
    { 
      title: "Champion Accounts", 
      count: stats?.championAccounts || 77, 
      color: "bg-teal-500",
      description: "Premium champion tier accounts"
    },
    { 
      title: "NDB Accounts", 
      count: stats?.ndbAccounts || 22169, 
      color: "bg-teal-500",
      description: "No Deposit Bonus accounts"
    },
    { 
      title: "Social Trading Accounts", 
      count: stats?.socialTradingAccounts || 370, 
      color: "bg-teal-500",
      description: "Copy trading enabled accounts"
    },
    { 
      title: "Bonus Shifting Accounts", 
      count: stats?.bonusShiftingAccounts || 518, 
      color: "bg-teal-500",
      description: "Accounts with bonus transfers"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">Accounts</h1>
          <p className="text-muted-foreground">Overview of all account types</p>
        </div>
      </div>

      <div className="grid gap-4">
        {accountTypes.map((account, index) => (
          <Card key={index} className="p-6 border-card-border hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-600 mb-1">
                  {account.title}
                </h3>
                <p className="text-sm text-muted-foreground">{account.description}</p>
              </div>
              <Badge 
                className={`${account.color} text-white text-2xl px-6 py-3 font-bold hover:${account.color}`}
              >
                {account.count.toLocaleString()}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

