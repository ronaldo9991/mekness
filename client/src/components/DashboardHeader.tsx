import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { User as UserType } from "@shared/schema";

export default function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [, setLocation] = useLocation();

  // Fetch current user data
  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ["/api/auth/check"],
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      setLocation("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = () => {
    if (!user?.fullName) return user?.username?.slice(0, 2).toUpperCase() || "U";
    const names = user.fullName.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : user.fullName.slice(0, 2).toUpperCase();
  };

  const displayName = isLoading ? "Loading..." : (user?.fullName || user?.username || "User");

  return (
    <header className="flex items-center justify-between p-4 border-b border-primary/20 bg-background/95 backdrop-blur-xl shadow-lg shadow-primary/5">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" className="hover:bg-primary/10 transition-colors" />
        <div className="text-sm text-muted-foreground font-mono" data-testid="text-current-time">
          <span className="hidden sm:inline text-primary font-semibold mr-2">⚡ LIVE</span>
          {currentTime.toLocaleString()}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 hover:bg-primary/10 transition-all duration-200" data-testid="button-user-menu">
            <Avatar className="w-8 h-8 ring-2 ring-primary/30">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline font-medium">{displayName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-semibold">{displayName}</span>
              <span className="text-xs text-muted-foreground">{user?.email || ""}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem data-testid="menu-profile" onClick={() => setLocation("/dashboard/profile")}>
            <User className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="menu-settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem data-testid="menu-logout" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
