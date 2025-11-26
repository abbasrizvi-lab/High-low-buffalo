import HerdCard from "@/components/herds/HerdCard";
import { HerdFormDialog } from "@/components/herds/HerdFormDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Herd, User } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

const HerdsPage = () => {
  const [herds, setHerds] = useState<Herd[]>([]);
  const { user, session } = useAuth();

  const fetchHerds = async () => {
    if (!session?.access_token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/herds`, {
          headers: {
              'Authorization': `Bearer ${session.access_token}`
          }
      });

      if (!response.ok) throw new Error("Failed to fetch herds");

      const data = await response.json();

      // Map backend snake_case and nested structure to frontend CamelCase and flat structure
      const mappedHerds: Herd[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          creatorId: item.creator_id,
          // Backend returns members: [{ user: { ... } }, ... ]
          // Frontend expects members: [ { ... }, ... ]
          members: item.members.map((m: any) => ({
              id: m.user.id,
              email: m.user.email,
              name: m.user.username || m.user.email || "Unknown",
              avatarUrl: m.user.avatar_url
          }))
      }));

      setHerds(mappedHerds);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load herds", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchHerds();
  }, [session]);

  const currentUser: User | null = user ? {
      id: user.id,
      name: user.user_metadata?.full_name || user.email || "Me",
      email: user.email || ""
  } : null;

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Herds</h1>
          <p className="text-gray-600">
            Manage your private groups for sharing reflections.
          </p>
        </div>
        <HerdFormDialog onHerdCreated={fetchHerds} />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {herds.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-8">No herds yet. Create one to get started!</p>
        ) : (
            herds.map((herd) => (
            <HerdCard key={herd.id} herd={herd} currentUser={currentUser} onDelete={fetchHerds} />
            ))
        )}
      </div>
    </div>
  );
};

export default HerdsPage;