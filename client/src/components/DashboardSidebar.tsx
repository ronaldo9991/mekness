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
  FileText,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  User,
  LogOut,
  TrendingUp,
  MessageSquare,
  Download,
  ArrowRightLeft,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import Logo from "./Logo";
import { useLocation } from "wouter";
import { Button } from "./ui/button";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Trading Accounts", icon: Wallet, url: "/dashboard/accounts" },
  { title: "Trading History", icon: History, url: "/dashboard/history" },
  { title: "Deposit", icon: ArrowDownToLine, url: "/dashboard/deposit" },
  { title: "Withdraw", icon: ArrowUpFromLine, url: "/dashboard/withdraw" },
  { title: "Internal Transfer", icon: ArrowRightLeft, url: "/dashboard/internal-transfer" },
  { title: "External Transfer", icon: ArrowRight, url: "/dashboard/external-transfer" },
  { title: "IB Account", icon: UserPlus, url: "/dashboard/ib-account" },
  { title: "Downloads", icon: Download, url: "/dashboard/downloads" },
  { title: "Documents", icon: FileText, url: "/dashboard/documents" },
  { title: "Support", icon: MessageSquare, url: "/dashboard/support" },
  { title: "Profile", icon: User, url: "/dashboard/profile" },
];

export default function DashboardSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-logout">
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
