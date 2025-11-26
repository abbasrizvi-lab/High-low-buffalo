import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const InviteConnectionForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        if (user.email === email) {
            setError("You cannot send a connection request to yourself.");
            return;
        }

        try {
            // Get recipient user
            const { data: recipient_id, error: rpcError } = await supabase.rpc(
                "get_user_id_by_email",
                { user_email: email }
            );

            if (rpcError || !recipient_id) {
                setError("User not found.");
                return;
            }

            // Check if a connection already exists
            const { data: existingConnection, error: existingConnectionError } = await supabase
                .from('connections')
                .select('id')
                .or(`and(requester_id.eq.${user.id},recipient_id.eq.${recipient_id}),and(requester_id.eq.${recipient_id},recipient_id.eq.${user.id})`);


            if (existingConnectionError) {
                setError("Error checking for existing connection.");
                return;
            }

            if (existingConnection && existingConnection.length > 0) {
                setError("A connection request already exists with this user.");
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setError("You must be logged in to send invitations.");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/connections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    requester_id: user.id,
                    email,
                    status: 'pending',
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                }),
            });

            if (response.ok) {
                setEmail("");
                setSuccess("Invitation sent successfully!");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to send invitation.");
            }
        } catch (error) {
            setError("An unexpected error occurred. Please try again.");
        }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite a Connection</CardTitle>
        <CardDescription>
          Enter the email of the person you want to connect with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleInvite}>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit">
              <PlusCircle className="h-4 w-4 mr-2" />
              Send Invite
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}
        </form>
      </CardContent>
    </Card>
  );
};

export default InviteConnectionForm;