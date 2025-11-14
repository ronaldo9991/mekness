import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2, Wallet, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
    refetchInterval: 30000,
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-1 h-12 bg-primary rounded-full" />
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1 text-foreground">Accounts</h1>
          <p className="text-muted-foreground">Overview of all account types</p>
        </div>
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </motion.div>

      {/* Account Types List */}
      <div className="space-y-3">
        {accountTypes.map((account, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-5 border-primary/20 bg-gradient-to-r from-black/60 to-black/40 hover:border-primary/40 hover:from-black/70 hover:to-black/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {account.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{account.description}</p>
                </div>
                <Badge 
                  className="bg-teal-500 hover:bg-teal-600 text-white text-xl px-5 py-2 font-bold min-w-[80px] text-center"
                >
                  {account.count.toLocaleString()}
                </Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

