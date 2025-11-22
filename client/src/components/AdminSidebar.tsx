import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  FileText,
  Wallet,
  Activity,
  Shield,
  LogOut,
  Download,
  ArrowUpDown,
  CreditCard,
  MessageSquare,
  Archive,
  Settings,
  Globe,
} from "lucide-react";
import Logo from "./Logo";
import { useLocation } from "wouter";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type { AdminUser } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface AdminSidebarProps {
  admin: AdminUser;
}

interface AdminStats {
  pendingDeposits: number;
  pendingWithdrawals: number;
  pendingDocuments: number;
  openTickets: number;
}

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  // Debug: Log admin role to console
  console.log("[AdminSidebar] Admin role:", admin?.role, "Admin object:", admin);

  // Fetch stats for badges
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  // Compute menu items - ensure it's reactive to admin changes using useMemo
  const menuItems = useMemo(() => {
    const baseItems = [
      { title: "Dashboard", icon: Home, url: "/admin/dashboard", badge: null, disabled: false },
      { title: "Clients", icon: Users, url: "/admin/clients", badge: null, disabled: false },
      { title: "Countries", icon: Globe, url: "/admin/countries", badge: null, disabled: false },
      { title: "Pending Documents", icon: FileText, url: "/admin/documents", badge: stats?.pendingDocuments, disabled: false },
      { title: "Deposits", icon: Download, url: "/admin/deposits", badge: stats?.pendingDeposits, disabled: false },
      { title: "Withdrawals", icon: ArrowUpDown, url: "/admin/withdrawals", badge: stats?.pendingWithdrawals, disabled: false },
      { title: "Withdrawals OTP", icon: CreditCard, url: "/admin/withdrawals-otp", badge: null, disabled: false },
      { title: "Funds Transfer", icon: Wallet, url: "/admin/fund-transfer", badge: null, disabled: false },
      { title: "TopUp", icon: CreditCard, url: "/admin/topup", badge: null, disabled: false },
      { title: "IB CB Wallets", icon: Wallet, url: "/admin/ib-cb-wallets", badge: null, disabled: false },
      { title: "IB Referrals", icon: Users, url: "/admin/referrals", badge: null, disabled: false },
      { title: "Commissions", icon: Wallet, url: "/admin/commissions", badge: null, disabled: false },
      { title: "Management", icon: Settings, url: "/admin/management", badge: null, disabled: false },
      { title: "Support", icon: MessageSquare, url: "/admin/support", badge: stats?.openTickets, disabled: false },
      { title: "Reports", icon: FileText, url: "/admin/reports", badge: null, disabled: false },
      { title: "Logs", icon: Activity, url: "/admin/logs", badge: null, disabled: false },
    ];

    // Check if admin exists and determine if super admin
    if (!admin) {
      console.log("[AdminSidebar] No admin object, returning base items");
      return baseItems;
    }
    
    // Normalize role check - handle various formats
    const adminRole = String(admin.role || "").toLowerCase().trim();
    const isSuperAdmin = adminRole === "super_admin" || adminRole === "superadmin";
    
    console.log("[AdminSidebar] Admin role check:", {
      adminRole,
      rawRole: admin.role,
      isSuperAdmin,
      adminId: admin.id,
      adminEmail: admin.email,
      fullRole: admin.role
    });
    
    // Always add Create Admins menu item, but mark as disabled for non-super-admins
    const items = [...baseItems];
    
    const createAdminsItem = { 
      title: "Create Admins", 
      icon: Shield, 
      url: "/admin/create-admins", 
      badge: null,
      disabled: !isSuperAdmin
    };
    
    // Insert Create Admins right after Dashboard for visibility
    items.splice(1, 0, createAdminsItem);
    
    // Add Admin Management menu item only for super admins
    if (isSuperAdmin) {
      const adminManagementItem = { 
        title: "Admin Management", 
        icon: Users, 
        url: "/admin/admins", 
        badge: null,
        disabled: false
      };
      items.push(adminManagementItem);
      console.log("[AdminSidebar] ✅ Added Create Admins and Admin Management items. Total items:", items.length);
    } else {
      console.log("[AdminSidebar] Added Create Admins (disabled). Role:", adminRole);
    }
    
    return items;
  }, [admin, admin?.role, stats]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/auth/logout");
      
      queryClient.clear();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === "super_admin") return "default";
    if (role === "middle_admin") return "secondary";
    return "outline";
  };

  const getRoleLabel = (role: string) => {
    if (role === "super_admin") return "Super Admin";
    if (role === "middle_admin") return "Middle Admin";
    return "Admin";
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-card-border">
        <div className="flex items-center gap-3 mb-3">
          <Logo />
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(admin.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate" data-testid="text-admin-name">
              {admin.fullName}
            </div>
            <Badge variant={getRoleBadgeVariant(admin.role)} className="text-xs" data-testid="badge-admin-role">
              {getRoleLabel(admin.role)}
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!item.disabled}
                    disabled={item.disabled}
                    isActive={location === item.url || location.startsWith(item.url + "/")}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {item.disabled ? (
                      <div className="flex items-center justify-between w-full cursor-not-allowed">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          <Badge variant="outline" className="ml-1 text-xs">Super Admin Only</Badge>
                        </div>
                        {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <a href={item.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-card-border">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
