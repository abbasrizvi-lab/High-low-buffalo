import ConnectionList from "@/components/connections/ConnectionList";
import InviteConnectionForm from "@/components/connections/InviteConnectionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockConnections, mockPendingConnections } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const ConnectionsPage = () => {
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
            {mockPendingConnections.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                {mockPendingConnections.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="connections">
            <ConnectionList connections={mockConnections} type="accepted" />
        </TabsContent>
        <TabsContent value="pending">
            <ConnectionList connections={mockPendingConnections} type="pending" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionsPage;