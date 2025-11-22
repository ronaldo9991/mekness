import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Bitcoin, DollarSign, CheckCircle2 } from "lucide-react";
import type { Deposit as DepositType, TradingAccount } from "@shared/schema";
import { useLocation } from "wouter";
// Stripe payment integration

export default function Deposit() {
  const [location, setLocation] = useLocation();
  const [account, setAccount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [cryptocurrency, setCryptocurrency] = useState("BTC");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  // Fetch trading accounts
  const { data: accounts = [], isLoading: loadingAccounts } = useQuery<TradingAccount[]>({
    queryKey: ["/api/trading-accounts"],
    refetchInterval: 30000,
  });

  // Fetch deposits with real-time updates
  const { data: deposits = [], isLoading: loadingDeposits } = useQuery<DepositType[]>({
    queryKey: ["/api/deposits"],
    refetchInterval: 15000,
  });

  // Handle callback from Stripe payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("payment_intent"); // Stripe uses this param name for session ID in redirect
    const success = urlParams.get("success");
    const error = urlParams.get("error");

    if (success === "true" && sessionId) {
      // Check payment status
      apiRequest("GET", `/api/stripe/payment-status/${sessionId}`)
        .then((status) => {
          if (status.status === "succeeded") {
            toast({
              title: "Payment Successful",
              description: "Your payment has been processed successfully.",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/deposits"] });
            queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
            queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
          }
        })
        .catch(() => {
          // Silently fail - webhook will handle it
        });
      // Clean URL
      setLocation("/dashboard/deposit");
    } else if (error === "true") {
      toast({
        title: "Payment Failed",
        description: "Your payment could not be processed. Please try again.",
        variant: "destructive",
      });
      // Clean URL
      setLocation("/dashboard/deposit");
    }
  }, []);

  // Handle Stripe Payment
  const handleStripePayment = async () => {
    try {
      setProcessing(true);

      // Create checkout session
      const response = await apiRequest("POST", "/api/stripe/create-payment-intent", {
        amount: parseFloat(amount),
        tradingAccountId: account,
        paymentMethod: merchant === "stripe-crypto" ? "crypto" : "card",
      });

      if (!response.url) {
        throw new Error("Failed to get payment URL");
      }

      // Redirect to Stripe Checkout
      toast({
        title: "Redirecting to Payment",
        description: "You will be redirected to complete your payment...",
      });
      
      window.location.href = response.url;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account || !amount || parseFloat(amount) < 10) {
      toast({
        title: "Error",
        description: "Please select an account and enter a valid amount (minimum $10)",
        variant: "destructive",
      });
      return;
    }

    if (merchant === "stripe-card" || merchant === "stripe-crypto") {
      await handleStripePayment();
    } else {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      key: "accountId",
      label: "Account",
      render: (value: string) => {
        const acc = accounts.find((a) => a.id === value);
        return <span className="font-mono font-semibold">{acc?.accountId || "-"}</span>;
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: string) => (
        <span className="font-semibold text-primary">${parseFloat(value).toFixed(2)}</span>
      ),
    },
    {
      key: "merchant",
      label: "Method",
      render: (value: string) => <span className="text-muted-foreground">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const variant =
          value === "Approved" ? "default" : value === "Pending" ? "secondary" : "destructive";
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    {
      key: "transactionId",
      label: "Transaction ID",
      render: (value: string) => (
        <span className="font-mono text-xs text-muted-foreground">{value || "-"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loadingAccounts || loadingDeposits) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl" />
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          Deposit Funds
        </h1>
        <p className="text-muted-foreground">Add funds to your trading account securely with Stripe</p>
      </div>

      {/* Deposit Form */}
      <Card className="relative p-6 border-primary/30 bg-gradient-to-br from-black/80 to-primary/5 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="account" className="text-primary uppercase tracking-wider text-xs font-bold">
                Trading Account
              </Label>
              <Select value={account} onValueChange={setAccount}>
                <SelectTrigger 
                  id="account" 
                  data-testid="select-account"
                  className="border-primary/30 bg-black/40 focus:border-primary"
                >
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30">
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.accountId} - {acc.type} (${parseFloat(acc.balance).toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="merchant" className="text-primary uppercase tracking-wider text-xs font-bold">
                Payment Method
              </Label>
              <Select value={merchant} onValueChange={setMerchant}>
                <SelectTrigger 
                  id="merchant" 
                  data-testid="select-merchant"
                  className="border-primary/30 bg-black/40 focus:border-primary"
                >
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30">
                  <SelectItem value="stripe-card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Credit/Debit Card (Stripe)
                    </div>
                  </SelectItem>
                  <SelectItem value="stripe-crypto">
                    <div className="flex items-center gap-2">
                      <Bitcoin className="w-4 h-4" />
                      Cryptocurrency (Stripe)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {merchant === "stripe-crypto" && (
            <div className="space-y-2">
              <Label htmlFor="crypto" className="text-primary uppercase tracking-wider text-xs font-bold">
                Select Cryptocurrency
              </Label>
              <Select value={cryptocurrency} onValueChange={setCryptocurrency}>
                <SelectTrigger 
                  id="crypto"
                  className="border-primary/30 bg-black/40 focus:border-primary"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30">
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="USDT">Tether (USDT)</SelectItem>
                  <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-primary uppercase tracking-wider text-xs font-bold">
              Amount (USD)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="100.00"
              min="10"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="input-amount"
              className="border-primary/30 bg-black/40 focus-visible:ring-primary text-lg font-semibold"
              required
              disabled={processing}
            />
            <p className="text-xs text-muted-foreground">Minimum deposit: $10.00</p>
          </div>

          <Button
            type="submit"
            className="w-full neon-gold text-lg font-bold py-6"
            data-testid="button-submit"
            disabled={processing || !account || !merchant || !amount}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-5 w-5" />
                Deposit ${amount || "0.00"}
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Benefits Section */}
      <Card className="relative p-6 border-primary/30 bg-gradient-to-br from-black/80 to-green-500/5 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-green-400 mb-4 uppercase tracking-wider">
            <CheckCircle2 className="inline mr-2 w-5 h-5" />
            Secure & Fast Deposits
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">Instant Processing:</strong> Deposits are processed immediately after approval
            </div>
            <div>
              <strong className="text-foreground">Secure Payment:</strong> Bank-grade encryption with Stripe
            </div>
            <div>
              <strong className="text-foreground">Multiple Methods:</strong> Credit cards and cryptocurrency supported
            </div>
            <div>
              <strong className="text-foreground">24/7 Support:</strong> Our team is here to help anytime
            </div>
          </div>
        </div>
      </Card>

      {/* Deposit History */}
      <div>
        <h2 className="text-2xl font-bold text-primary uppercase tracking-wider mb-4">Deposit History</h2>
        {deposits.length > 0 ? (
          <Card className="border-primary/30 bg-black/80 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="p-6">
              <DataTable columns={columns} data={deposits} />
            </div>
          </Card>
        ) : (
          <Card className="relative p-12 text-center border-primary/30 bg-black/80 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="text-muted-foreground">No deposits yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
