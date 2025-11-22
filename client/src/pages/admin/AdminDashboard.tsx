import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Route } from "wouter";
import { Loader2, Shield } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/AdminSidebar";
import AdminDashboardOverview from "./AdminDashboardOverview";
import AdminClients from "./AdminClients";
import AdminCountries from "./AdminCountries";
import AdminDeposits from "./AdminDeposits";
import AdminWithdrawals from "./AdminWithdrawals";
import AdminAccounts from "./AdminAccounts";
import AdminFundTransfer from "./AdminFundTransfer";
import AdminIBCBWallets from "./AdminIBCBWallets";
import AdminReferrals from "./AdminReferrals";
import AdminCommissions from "./AdminCommissions";
import AdminManagement from "./AdminManagement";
import AdminSupport from "./AdminSupport";
import AdminLogs from "./AdminLogs";
import AdminDocuments from "./AdminDocuments";
import AdminCreation from "./AdminCreation";
import SuperAdminDashboard from "./SuperAdminDashboard";
import MiddleAdminDashboard from "./MiddleAdminDashboard";
import NormalAdminDashboard from "./NormalAdminDashboard";
import type { AdminUser } from "@shared/schema";

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();

  const { data: admin, isLoading, error } = useQuery<AdminUser>({
    queryKey: ["/api/admin/auth/me"],
    retry: false,
  });

  useEffect(() => {
    if (error || (!isLoading && !admin)) {
      setLocation("/admin/login");
    }
  }, [admin, isLoading, error, setLocation]);

  // Redirect to dashboard if on base admin route
  useEffect(() => {
    if (admin && location === "/admin" || location === "/admin/") {
      setLocation("/admin/dashboard");
    }
  }, [admin, location, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="w-12 h-12 animate-spin text-primary" data-testid="loader-admin-auth" />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const style = {
    "--sidebar-width": "20rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar admin={admin} />
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-accent/5 to-background">
          <Route path="/admin/dashboard">
            <AdminDashboardOverview admin={admin} />
          </Route>
          <Route path="/admin/clients">
            <AdminClients />
          </Route>
          <Route path="/admin/countries">
            <AdminCountries />
          </Route>
          <Route path="/admin/documents">
            <AdminDocuments admin={admin} />
          </Route>
          <Route path="/admin/deposits">
            <AdminDeposits />
          </Route>
          <Route path="/admin/withdrawals">
            <AdminWithdrawals />
          </Route>
          <Route path="/admin/accounts">
            <AdminAccounts />
          </Route>
          <Route path="/admin/fund-transfer">
            <AdminFundTransfer />
          </Route>
          <Route path="/admin/ib-cb-wallets">
            <AdminIBCBWallets />
          </Route>
          <Route path="/admin/referrals">
            <AdminReferrals />
          </Route>
          <Route path="/admin/commissions">
            <AdminCommissions />
          </Route>
          <Route path="/admin/management">
            <AdminManagement />
          </Route>
          <Route path="/admin/support">
            <AdminSupport />
          </Route>
          <Route path="/admin/logs">
            <AdminLogs />
          </Route>
          <Route path="/admin/create-admins">
            {(() => {
              // Normalize role check - handle various formats
              const adminRoleRaw = String(admin?.role || "").trim();
              const adminRole = adminRoleRaw.toLowerCase().replace(/[-\s_]+/g, "_");
              const isSuperAdmin = adminRole === "super_admin" || adminRole === "superadmin" || adminRoleRaw.toLowerCase() === "super admin";
              
              // Debug logging
              console.log("[AdminDashboard] Create Admins Route Check:", {
                rawRole: admin?.role,
                adminRoleRaw,
                normalizedRole: adminRole,
                isSuperAdmin,
                adminId: admin?.id,
                adminEmail: admin?.email,
                adminFullName: admin?.fullName,
              });
              
              if (isSuperAdmin) {
                console.log("[AdminDashboard] ✅ Allowing access to Create Admins page for super admin");
                return <AdminCreation admin={admin} />;
              }
              
              console.log("[AdminDashboard] ❌ Blocking access - not super admin. Role:", adminRole);
              return (
                <div className="flex items-center justify-center min-h-[60vh]">
                  <Card className="p-8 max-w-md w-full border-destructive/50">
                    <div className="text-center space-y-4">
                      <Shield className="w-16 h-16 mx-auto text-destructive/70" />
                      <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
                      <p className="text-muted-foreground">
                        Only Super Administrators can create admin accounts.
                      </p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Your current role: <Badge variant="outline">{admin?.role || "Admin"}</Badge>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Raw role value: "{admin?.role}" | Normalized: "{adminRole}"
                      </p>
                      <Button
                        onClick={() => setLocation("/admin/dashboard")}
                        variant="outline"
                        className="mt-4"
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })()}
          </Route>
          <Route path="/admin/admins">
            {admin.role === "super_admin" ? (
              <SuperAdminDashboard admin={admin} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
                  <p className="text-muted-foreground">
                    Only Super Administrators can manage admin accounts.
                  </p>
                </div>
              </div>
            )}
          </Route>
          <Route path="/admin">
            <AdminDashboardOverview admin={admin} />
          </Route>
        </main>
      </div>
    </SidebarProvider>
  );
}
