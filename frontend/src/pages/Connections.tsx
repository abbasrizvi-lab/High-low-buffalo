import ConnectionList from "@/components/connections/ConnectionList";
import InviteConnectionForm from "@/components/connections/InviteConnectionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import { Connection } from "@/types";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const ConnectionsPage = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingConnections, setPendingConnections] = useState<Connection[]>([]);

  const fetchConnections = async () => {
    const { data, error } = await supabase.rpc('fetch_connections');

    if (error) {
      console.error("Error fetching connections:", error);
      return;
    }

    const formattedData = data.map(c => ({
      id: c.id,
      requester_id: c.requester_id,
      recipient_id: c.recipient_id,
      status: c.status,
      created_at: c.created_at,
      updated_at: c.updated_at,
      user: {
        id: c.user_id,
        name: c.user_name,
        email: c.user_email,
        avatarUrl: c.user_avatar_url,
      }
    }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const accepted = formattedData.filter(c => c.status === 'accepted');
    const pending = formattedData.filter(c => c.status === 'pending' && c.recipient_id === user.id);

    setConnections(accepted as any);
    setPendingConnections(pending as any);
  };

  useEffect(() => {
    fetchConnections();
    const channel = supabase.channel('connections-follow-up');
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'connections' }, () => {
        fetchConnections();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, []);

  const handleAccept = async (connectionId: string) => {
    const { error } = await supabase
      .from("connections")
      .update({ status: "accepted" })
      .eq("id", connectionId);
    if (error) {
      console.error(error);
    } else {
      fetchConnections();
    }
  };

  const handleDecline = async (connectionId: string) => {
    const { error } = await supabase
      .from("connections")
      .delete()
      .eq("id", connectionId);
    if (error) {
      console.error(error);
    } else {
      fetchConnections();
    }
  };

  const handleRemove = async (connectionId: string) => {
    const { error } = await supabase
      .from("connections")
      .delete()
      .eq("id", connectionId);
    if (error) {
      console.error(error);
    } else {
      fetchConnections();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="text-gray-600">
          Manage your connections and view pending requests.
        </p>
      </header>

      <InviteConnectionForm />

      <Tabs defaultValue="connections" className="mt-8">
        <TabsList>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending Requests
            {pendingConnections.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                {pendingConnections.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="connections">
          <ConnectionList
            connections={connections}
            type="accepted"
            onRemove={handleRemove}
          />
        </TabsContent>
        <TabsContent value="pending">
          <ConnectionList
            connections={pendingConnections}
            type="pending"
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionsPage;