import { NavLink } from "react-router-dom";
import { Home, Users, Heart, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { to: "/herds", icon: <Users className="h-5 w-5" />, label: "Herds" },
    { to: "/connections", icon: <Heart className="h-5 w-5" />, label: "Connections" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-gray-50 flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">High-Low-Buffalo</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold text-sm">Alex</p>
                <p className="text-xs text-gray-500">alex@example.com</p>
            </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3">
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;