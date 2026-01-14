import { 
  LayoutDashboard, 
  GitBranch, 
  Play, 
  Settings, 
  FileText, 
  CreditCard,
  ChevronDown,
  Dumbbell,
  LogOut,
  CheckSquare
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Repos", href: "/repos", icon: GitBranch },
  { name: "Dojo Runs", href: "/runs", icon: Play },
  { name: "Dojo Checks", href: "/checks", icon: CheckSquare },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const org = JSON.parse(localStorage.getItem('shipdojo_org') || '{}');
  const user = JSON.parse(localStorage.getItem('shipdojo_user') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('shipdojo_user');
    localStorage.removeItem('shipdojo_org');
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="p-2 rounded-lg bg-sidebar-primary/10">
          <Dumbbell className="w-5 h-5 text-sidebar-primary" />
        </div>
        <span className="font-bold text-lg text-sidebar-foreground">ShipDojo</span>
      </div>
      
      {/* Org Selector */}
      <div className="p-4 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between p-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                {(org.name || 'D')[0].toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-sidebar-foreground truncate max-w-[140px]">
                  {org.name || 'Demo Org'}
                </p>
                {org.demo_mode && (
                  <Badge variant="info" className="text-[10px] px-1 py-0">Demo Mode</Badge>
                )}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-sidebar-foreground/50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">Switch organization...</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-primary/10 text-sidebar-primary" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4",
                isActive ? "text-sidebar-primary" : "text-sidebar-foreground/70"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* User Menu */}
      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name || 'Demo User'}
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                {user.email || 'demo@shipdojo.dev'}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
