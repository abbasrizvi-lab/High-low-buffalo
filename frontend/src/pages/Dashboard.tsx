import { CreateReflectionDialog } from "@/components/reflections/CreateReflectionDialog";
import ReflectionCard from "@/components/reflections/ReflectionCard";
import { mockCurrentUser } from "@/lib/mock-data";
import { supabase } from "@/lib/supabaseClient";
import { Reflection } from "@/types";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);

  useEffect(() => {
    const fetchReflections = async () => {
      const { data, error } = await supabase
        .from("reflections")
        .select(`
          *,
          author:users(*)
        `);

      if (error) {
        console.error(error);
      } else {
        setReflections(data as any);
      }
    };

    fetchReflections();
  }, []);

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
        {reflections.map((reflection) => (
          <ReflectionCard
            key={reflection.id}
            reflection={reflection}
            currentUser={mockCurrentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;