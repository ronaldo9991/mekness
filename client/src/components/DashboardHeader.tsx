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

export default function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
                JD
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline font-medium">John Doe</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-semibold">John Doe</span>
              <span className="text-xs text-muted-foreground">john@example.com</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem data-testid="menu-profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="menu-settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem data-testid="menu-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
