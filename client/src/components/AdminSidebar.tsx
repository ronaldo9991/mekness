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

  const getMenuItems = () => {
    const baseItems = [
      { title: "Dashboard", icon: Home, url: "/admin/dashboard", badge: null },
      { title: "Clients", icon: Users, url: "/admin/clients", badge: null },
      { title: "Countries", icon: Globe, url: "/admin/countries", badge: null },
      { title: "Pending Documents", icon: FileText, url: "/admin/documents", badge: stats?.pendingDocuments },
      { title: "Deposits", icon: Download, url: "/admin/deposits", badge: stats?.pendingDeposits },
      { title: "Withdrawals", icon: ArrowUpDown, url: "/admin/withdrawals", badge: stats?.pendingWithdrawals },
      { title: "Withdrawals OTP", icon: CreditCard, url: "/admin/withdrawals-otp", badge: null },
      { title: "Funds Transfer", icon: Wallet, url: "/admin/fund-transfer", badge: null },
      { title: "TopUp", icon: CreditCard, url: "/admin/topup", badge: null },
      { title: "IB CB Wallets", icon: Wallet, url: "/admin/ib-cb-wallets", badge: null },
      { title: "IB Referrals", icon: Users, url: "/admin/referrals", badge: null },
      { title: "Commissions", icon: Wallet, url: "/admin/commissions", badge: null },
      { title: "Management", icon: Settings, url: "/admin/management", badge: null },
      { title: "Support", icon: MessageSquare, url: "/admin/support", badge: stats?.openTickets },
      { title: "Reports", icon: FileText, url: "/admin/reports", badge: null },
      { title: "Logs", icon: Activity, url: "/admin/logs", badge: null },
    ];

    // Super admin gets additional items - check role explicitly
    const isSuperAdmin = admin?.role === "super_admin" || admin?.role === "SUPER_ADMIN";
    
    if (isSuperAdmin) {
      // Insert Create Admins right after Dashboard for visibility
      baseItems.splice(1, 0, { title: "Create Admins", icon: Shield, url: "/admin/create-admins", badge: null });
      baseItems.push({ title: "Admin Management", icon: Users, url: "/admin/admins", badge: null });
    }

    // Middle admin and normal admin see filtered items based on permissions
    // (This will be handled in the individual pages)
    return baseItems;
  };

  const menuItems = getMenuItems();

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
                    asChild
                    isActive={location === item.url || location.startsWith(item.url + "/")}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
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
