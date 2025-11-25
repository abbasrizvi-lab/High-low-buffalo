import HerdCard from "@/components/herds/HerdCard";
import { HerdFormDialog } from "@/components/herds/HerdFormDialog";
import { mockCurrentUser } from "@/lib/mock-data";
import { supabase } from "@/lib/supabaseClient";
import { Herd } from "@/types";
import { useEffect, useState } from "react";

const HerdsPage = () => {
  const [herds, setHerds] = useState<Herd[]>([]);

  useEffect(() => {
    const fetchHerds = async () => {
      const { data, error } = await supabase
        .from("herds")
        .select(`
          *,
          members:users(*)
        `);

      if (error) {
        console.error(error);
      } else {
        setHerds(data as any);
      }
    };

    fetchHerds();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Herds</h1>
          <p className="text-gray-600">
            Manage your private groups for sharing reflections.
          </p>
        </div>
        <HerdFormDialog />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {herds.map((herd) => (
          <HerdCard key={herd.id} herd={herd} currentUser={mockCurrentUser} />
        ))}
      </div>
    </div>
  );
};

export default HerdsPage;