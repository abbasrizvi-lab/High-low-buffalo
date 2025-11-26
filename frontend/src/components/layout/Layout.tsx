import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Layout = () => {
  const { session } = useAuth();

  useEffect(() => {
    if (!session?.access_token) return;

    const checkNotification = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        const data = await response.json();
        
        if (data?.check_in_enabled && data.check_in_time) {
          const [hours, minutes] = data.check_in_time.split(':').map(Number);
          const now = new Date();
          
          if (now.getHours() === hours && now.getMinutes() === minutes) {
            // Check if we already notified today (simple local storage check)
            const lastNotified = localStorage.getItem('lastCheckInNotification');
            const today = new Date().toDateString();
            
            if (lastNotified !== today) {
              toast({
                title: "Time to Reflect! 🐃",
                description: "It's your scheduled time for a High-Low-Buffalo check-in.",
              });
              localStorage.setItem('lastCheckInNotification', today);
            }
          }
        }
      } catch (error) {
        console.error("Failed to check notifications", error);
      }
    };

    // Check every minute
    const interval = setInterval(checkNotification, 60000);
    checkNotification(); // Initial check

    return () => clearInterval(interval);
  }, [session]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;