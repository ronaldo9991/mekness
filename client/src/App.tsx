import { lazy, Suspense } from "react";
import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { PageLoadingSkeleton } from "@/components/ui/loading-skeleton";

// Lazy load all pages for code splitting
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Forex = lazy(() => import("@/pages/Forex"));
const Contact = lazy(() => import("@/pages/Contact"));
const Complaints = lazy(() => import("@/pages/Complaints"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));

// New Public Pages
const IntroducingBroker = lazy(() => import("@/pages/IntroducingBroker"));
const DepositsWithdrawals = lazy(() => import("@/pages/DepositsWithdrawals"));
const TradingContest = lazy(() => import("@/pages/TradingContest"));
const ButtonShowcase = lazy(() => import("@/pages/ButtonShowcase"));

// Forex Sub-Pages
const WhatIsForex = lazy(() => import("@/pages/WhatIsForex"));
const ForexAdvantages = lazy(() => import("@/pages/ForexAdvantages"));
const ForexPedia = lazy(() => import("@/pages/ForexPedia"));
const DepositBonus = lazy(() => import("@/pages/DepositBonus"));
const NoDepositBonus = lazy(() => import("@/pages/NoDepositBonus"));

// Dashboard Pages
const DashboardLayout = lazy(() => import("@/pages/dashboard/DashboardLayout"));
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const Documents = lazy(() => import("@/pages/dashboard/Documents"));
const TradingAccounts = lazy(() => import("@/pages/dashboard/TradingAccounts"));
const Deposit = lazy(() => import("@/pages/dashboard/Deposit"));
const Withdraw = lazy(() => import("@/pages/dashboard/Withdraw"));
const TradingHistory = lazy(() => import("@/pages/dashboard/TradingHistory"));
const Profile = lazy(() => import("@/pages/dashboard/Profile"));
const Support = lazy(() => import("@/pages/dashboard/Support"));
const Downloads = lazy(() => import("@/pages/dashboard/Downloads"));
const InternalTransfer = lazy(() => import("@/pages/dashboard/InternalTransfer"));
const ExternalTransfer = lazy(() => import("@/pages/dashboard/ExternalTransfer"));
const IBAccount = lazy(() => import("@/pages/dashboard/IBAccount"));

// Admin Pages
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/forex" component={Forex} />
      <Route path="/contact" component={Contact} />
      <Route path="/complaints" component={Complaints} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      
      {/* New Public Pages */}
      <Route path="/introducing-broker" component={IntroducingBroker} />
      <Route path="/deposits-withdrawals" component={DepositsWithdrawals} />
      <Route path="/trading-contest" component={TradingContest} />
      <Route path="/button-showcase" component={ButtonShowcase} />
      
      {/* Forex Sub-Pages */}
      <Route path="/what-is-forex" component={WhatIsForex} />
      <Route path="/forex-advantages" component={ForexAdvantages} />
      <Route path="/forexpedia" component={ForexPedia} />
      <Route path="/deposit-bonus" component={DepositBonus} />
      <Route path="/no-deposit-bonus" component={NoDepositBonus} />
      
      <Route path="/dashboard">
        <DashboardLayout>
          <DashboardHome />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/documents">
        <DashboardLayout>
          <Documents />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/accounts">
        <DashboardLayout>
          <TradingAccounts />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/deposit">
        <DashboardLayout>
          <Deposit />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/withdraw">
        <DashboardLayout>
          <Withdraw />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/history">
        <DashboardLayout>
          <TradingHistory />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/profile">
        <DashboardLayout>
          <Profile />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/support">
        <DashboardLayout>
          <Support />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/downloads">
        <DashboardLayout>
          <Downloads />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/internal-transfer">
        <DashboardLayout>
          <InternalTransfer />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/external-transfer">
        <DashboardLayout>
          <ExternalTransfer />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/ib-account">
        <DashboardLayout>
          <IBAccount />
        </DashboardLayout>
      </Route>

      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/:rest*" component={AdminDashboard} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<PageLoadingSkeleton />}>
            <AppRouter />
          </Suspense>
        </Router>
        <Toaster />
        <WhatsAppFloat />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
