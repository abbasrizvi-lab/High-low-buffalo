import { CreateReflectionDialog } from "@/components/reflections/CreateReflectionDialog";
import ReflectionCard from "@/components/reflections/ReflectionCard";
import { Reflection, User, Connection, Herd } from "@/types";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [herds, setHerds] = useState<Herd[]>([]);
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared' | 'reminders'>('all');
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

  const filteredReflections = reflections.filter(reflection => {
    if (filter === 'all') return true;
    if (filter === 'mine') return reflection.author_id === currentUser?.id;
    if (filter === 'shared') return reflection.author_id !== currentUser?.id;
    if (filter === 'reminders') return reflection.reminders?.some(r => r.user_id === currentUser?.id);
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold">Your Feed</h1>
                <p className="text-gray-600">Reflections from your connections and herds.</p>
            </div>
            <CreateReflectionDialog />
        </div>
        
        <div className="flex gap-2">
            <Button
                variant={filter === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('all')}
            >
                All
            </Button>
            <Button
                variant={filter === 'mine' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('mine')}
            >
                My History
            </Button>
            <Button
                variant={filter === 'shared' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('shared')}
            >
                Shared with Me
            </Button>
            <Button
                variant={filter === 'reminders' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('reminders')}
            >
                Reminders
            </Button>
        </div>
      </header>

      <div className="space-y-4">
        {currentUser && filteredReflections.map((reflection) => (
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
        {filteredReflections.length === 0 && (
            <p className="text-center text-gray-500 py-8">No reflections found.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;