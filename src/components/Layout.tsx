import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  LogOut,
  Menu,
  Award,
  User,
  ChevronDown,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";


function UserAvatar() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    if (user) {
      if(user.email) setInitials(user.email[0].toUpperCase());
      
      supabase
        .from("profiles")
        .select("avatar_url, full_name")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.avatar_url) setAvatarUrl(data.avatar_url);
          if (data?.full_name) setInitials(data.full_name[0].toUpperCase());
        });
    }
  }, [user]);

  if (avatarUrl) {
    return <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />;
  }
  return <span className="text-sm font-semibold text-sidebar-foreground">{initials}</span>;
}

function UserName() {
  const { user } = useAuth();
  const [name, setName] = useState("User");

  useEffect(() => {
    if (user) {
      setName(user.email?.split("@")[0] || "User"); // Fallback
      
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.full_name) setName(data.full_name);
        });
    }
  }, [user]);

  return <span className="text-sm font-medium">{name}</span>;
}

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Feedback", href: "/feedback", icon: MessageSquare },
];

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("role").eq("id", user.id).single()
        .then(({ data }) => setIsAdmin(data?.role === 'admin'));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 gradient-hero border-b border-sidebar-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <img src={logo} alt="Vision 360° Logo" className="h-12 w-auto object-contain" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-sidebar-foreground">Vision 360°</h1>
                <p className="text-xs text-sidebar-foreground/70">Safety Training System</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-auto p-1.5 pl-3 hover:bg-sidebar-accent hover:text-sidebar-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-foreground">
                       <span className="text-sm font-medium text-sidebar-foreground/80"><UserName /></span>
                       <ChevronDown className="h-4 w-4 text-muted-foreground" />
                       <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center overflow-hidden border border-sidebar-border">
                         <UserAvatar />
                       </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <span className="flex items-center gap-2">
                           <User className="h-4 w-4" />
                           My Profile
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/certificates" className="cursor-pointer">
                        <span className="flex items-center gap-2">
                           <Award className="h-4 w-4" />
                           My Certificates
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Admin</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/users" className="cursor-pointer">
                             Users & Staff
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/logs" className="cursor-pointer">
                             Activity Logs
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />

                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={() => supabase.auth.signOut()}
                    >
                      <span className="flex items-center gap-2">
                         <LogOut className="h-4 w-4" />
                         Sign out
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-sidebar-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sidebar-border animate-fade-in">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
