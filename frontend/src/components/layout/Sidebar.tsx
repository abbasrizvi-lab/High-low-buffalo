import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, UserCircle, LogOut, Network, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Feed" },
    { href: "/herds", icon: Users, label: "Herds" },
    { href: "/connections", icon: Network, label: "Connections" },
    { href: "/profile", icon: UserCircle, label: "Profile" },
  ];

  return (
    <div className="hidden border-r bg-gray-50/40 lg:block dark:bg-gray-900/40 w-64 min-h-screen flex flex-col backdrop-blur-xl">
      <div className="flex h-16 items-center border-b px-6 bg-background/50">
        <Link className="flex items-center gap-2 font-semibold text-lg tracking-tight" to="/">
          <span className="text-2xl">🦬</span>
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">High-Low-Buffalo</span>
        </Link>
      </div>
      <div className="flex-1 py-6">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:text-primary hover:bg-secondary/50",
                location.pathname === item.href
                  ? "bg-secondary text-primary shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto px-6 pb-6">
        <div className="mb-4 flex items-center gap-2 rounded-lg border bg-background/50 p-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-green-600" />
            <span>Privacy-First Storage</span>
        </div>
        <div className="border-t pt-4">
            <div className="flex items-center gap-3 mb-3 px-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {user?.user_metadata.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{user?.user_metadata.full_name || user?.email}</p>
                </div>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50/50" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;