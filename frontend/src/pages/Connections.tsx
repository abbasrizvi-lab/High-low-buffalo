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

  useEffect(() => {
    const fetchConnections = async () => {
      const { data, error } = await supabase
        .from("connections")
        .select(`
          *,
          user:users(*)
        `)
        .eq("status", "accepted");

      if (error) {
        console.error(error);
      } else {
        setConnections(data as any);
      }
    };

    const fetchPendingConnections = async () => {
      const { data, error } = await supabase
        .from("connections")
        .select(`
          *,
          user:users(*)
        `)
        .eq("status", "pending");

      if (error) {
        console.error(error);
      } else {
        setPendingConnections(data as any);
      }
    };

    fetchConnections();
    fetchPendingConnections();
  }, []);

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
            <ConnectionList connections={connections} type="accepted" />
        </TabsContent>
        <TabsContent value="pending">
            <ConnectionList connections={pendingConnections} type="pending" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionsPage;