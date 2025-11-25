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
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata.full_name || "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUpdateProfile = async () => {
    const userUpdates: { data: { full_name?: string }, password?: string } = {
      data: {},
    };

    if (fullName) {
      userUpdates.data.full_name = fullName;
    }

    if (password) {
      userUpdates.password = password;
    }

    const { error } = await supabase.auth.updateUser(userUpdates);

    if (error) {
      alert(error.message);
    } else {
      alert("Profile updated successfully!");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Profile</CardTitle>
          <CardDescription>
            Manage your account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" value={fullName} required onChange={(e) => setFullName(e.target.value)} />
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
              <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" onClick={handleUpdateProfile}>
              Update Profile
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;