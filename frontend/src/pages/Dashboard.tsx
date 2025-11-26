import { CreateReflectionDialog } from "@/components/reflections/CreateReflectionDialog";
import ReflectionCard from "@/components/reflections/ReflectionCard";
import { Reflection, User, Connection, Herd } from "@/types";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [herds, setHerds] = useState<Herd[]>([]);
  const { user, session } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.access_token) return;

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
      };

      try {
        const [reflectionsRes, connectionsRes, herdsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/reflections`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/connections`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/herds`, { headers })
        ]);

        if (!reflectionsRes.ok || !connectionsRes.ok || !herdsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const reflectionsData = await reflectionsRes.json();
        const connectionsData = await connectionsRes.json();
        const herdsData = await herdsRes.json();

        setReflections(reflectionsData);
        setConnections(connectionsData);
        setHerds(herdsData);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [session]);

  const handleDeleteReflection = (id: string) => {
    setReflections(prev => prev.filter(r => r.id !== id));
  };

  // Map Supabase user to our User type
  const currentUser: User | null = user ? {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.name || user.email || "Me",
  } : null;

  return (
    <div className="max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">Your Feed</h1>
            <p className="text-gray-600">Reflections from your connections and herds.</p>
        </div>
        <CreateReflectionDialog />
      </header>

      <div className="space-y-4">
        {currentUser && reflections.map((reflection) => (
          <ReflectionCard
            key={reflection.id}
            reflection={reflection}
            currentUser={currentUser}
            onDelete={handleDeleteReflection}
            token={session?.access_token}
            connections={connections}
            herds={herds}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;