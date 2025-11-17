import { useState } from "react";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TradingAccount } from "@shared/schema";

export default function TradingAccounts() {
  const [accountType, setAccountType] = useState("");
  const [accountGroup, setAccountGroup] = useState("");
  const [leverage, setLeverage] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Fetch trading accounts with real-time updates
  const { data: accounts = [], isLoading } = useQuery<TradingAccount[]>({
    queryKey: ["/api/trading-accounts"],
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/trading-accounts", data);
    },
    onSuccess: () => {
      toast({
        title: "Account Created",
        description: "Your trading account has been created successfully.",
      });
      setAccountType("");
      setAccountGroup("");
      setLeverage("");
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create trading account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateAccount = () => {
    if (!accountType || !accountGroup || !leverage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to create an account.",
        variant: "destructive",
      });
      return;
    }

    createAccountMutation.mutate({
      type: accountType,
      group: accountGroup,
      leverage,
    });
  };

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords((prev) => ({ ...prev, [accountId]: !prev[accountId] }));
  };

  const columns = [
    { 
      key: "accountId", 
      label: "Account ID",
      render: (value: string) => (
        <span className="font-mono font-semibold">{value}</span>
      ),
    },
    {
      key: "password",
      label: "Password",
      render: (_: string, row: TradingAccount) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">
            {showPasswords[row.accountId] ? row.password : "••••••••"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePasswordVisibility(row.accountId)}
            data-testid={`button-toggle-password-${row.accountId}`}
          >
            {showPasswords[row.accountId] ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
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
      key: "leverage",
      label: "Leverage",
      render: (value: string) => (
        <Button variant="ghost" size="sm" data-testid="button-change-leverage">
          {value}
        </Button>
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
      key: "createdAt", 
      label: "Created",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const liveAccounts = accounts.filter((acc) => acc.type === "Live");
  const demoAccounts = accounts.filter((acc) => acc.type === "Demo");
  const bonusAccounts = accounts.filter((acc) => acc.type === "Bonus");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Trading Accounts</h1>
        <p className="text-muted-foreground">
          Manage your trading accounts and leverage settings.
        </p>
      </div>

      <Card className="p-6 border-card-border">
        <h2 className="text-xl font-semibold mb-4">Request New Trading Account</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="accountType">Account Type</Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger id="accountType" data-testid="select-account-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Demo">Demo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accountGroup">Account Group</Label>
            <Select value={accountGroup} onValueChange={setAccountGroup}>
              <SelectTrigger id="accountGroup" data-testid="select-account-group">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Startup">Startup</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="leverage">Leverage</Label>
            <Select value={leverage} onValueChange={setLeverage}>
              <SelectTrigger id="leverage" data-testid="select-leverage">
                <SelectValue placeholder="Select leverage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:50">1:50</SelectItem>
                <SelectItem value="1:100">1:100</SelectItem>
                <SelectItem value="1:200">1:200</SelectItem>
                <SelectItem value="1:500">1:500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleCreateAccount}
          className="w-full mt-4"
          disabled={createAccountMutation.isPending}
          data-testid="button-open-account"
        >
          {createAccountMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Open Trading Account"
          )}
        </Button>
      </Card>

      {liveAccounts.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Live Accounts</h2>
          <DataTable columns={columns} data={liveAccounts} />
        </div>
      )}

      {demoAccounts.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Demo Accounts</h2>
          <DataTable columns={columns} data={demoAccounts} />
        </div>
      )}

      {bonusAccounts.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Bonus Accounts</h2>
          <DataTable columns={columns} data={bonusAccounts} />
        </div>
      )}

      {accounts.length === 0 && (
        <Card className="p-12 text-center border-card-border">
          <p className="text-muted-foreground">
            No trading accounts found. Create your first account above.
          </p>
        </Card>
      )}
    </div>
  );
}
