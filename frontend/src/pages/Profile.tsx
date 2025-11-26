import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user, session } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata.full_name || "");
  const [password, setPassword] = useState("");
  const [checkInTime, setCheckInTime] = useState("18:00");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.access_token) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        const data = await response.json();
        if (data) {
          setCheckInTime(data.check_in_time || "18:00");
          setNotificationsEnabled(data.check_in_enabled ?? true);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [session]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
        // Update Auth User (Password/Metadata)
        const userUpdates: { data: { full_name?: string }, password?: string } = {
            data: {},
        };

        if (fullName !== user?.user_metadata.full_name) {
            userUpdates.data.full_name = fullName;
        }

        if (password) {
            userUpdates.password = password;
        }

        if (Object.keys(userUpdates.data).length > 0 || userUpdates.password) {
            const { error } = await supabase.auth.updateUser(userUpdates);
            if (error) throw error;
        }

        // Update Public User Profile (Notifications)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
                check_in_time: checkInTime,
                check_in_enabled: notificationsEnabled
            })
        });

        if (!response.ok) throw new Error("Failed to update notification settings");

        toast({ title: "Success", description: "Profile updated successfully!" });
    } catch (error) {
        toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const { error } = await supabase.rpc('delete_user');
      if (error) {
        alert(error.message);
      } else {
        alert("Account deleted successfully!");
        await supabase.auth.signOut();
        navigate("/login");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-xl">Profile Settings</CardTitle>
          <CardDescription>
            Manage your account and notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Account</h3>
                <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={user?.email}
                    disabled
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="Leave blank to keep current" onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="notifications">Daily Check-in</Label>
                        <p className="text-sm text-muted-foreground">Receive a reminder to reflect.</p>
                    </div>
                    <Switch
                        id="notifications"
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                    />
                </div>
                {notificationsEnabled && (
                    <div className="grid gap-2">
                        <Label htmlFor="check-in-time">Check-in Time</Label>
                        <Input
                            id="check-in-time"
                            type="time"
                            value={checkInTime}
                            onChange={(e) => setCheckInTime(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 pt-4">
                <Button type="submit" className="w-full" onClick={handleUpdateProfile} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDeleteAccount}>
                Delete Account
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;