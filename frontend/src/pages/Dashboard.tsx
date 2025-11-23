import { CreateReflectionDialog } from "@/components/reflections/CreateReflectionDialog";
import ReflectionCard from "@/components/reflections/ReflectionCard";
import { mockCurrentUser, mockReflections } from "@/lib/mock-data";

const DashboardPage = () => {
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
        {mockReflections.map((reflection) => (
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