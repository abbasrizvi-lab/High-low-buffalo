import { Herd, User } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, LogOut, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { HerdFormDialog } from "./HerdFormDialog";

interface HerdCardProps {
  herd: Herd;
  currentUser: User;
  onDelete?: (id: string) => void;
}

const HerdCard = ({ herd, currentUser, onDelete }: HerdCardProps) => {
  const { session } = useAuth();
  const isCreator = herd.creatorId === currentUser.id;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this herd?")) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/herds/${herd.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete herd");
      
      toast({ title: "Success", description: "Herd deleted successfully" });
      onDelete?.(herd.id);
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this herd?")) return;
    setIsDeleting(true); // Reuse loading state
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/herds/${herd.id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) throw new Error("Failed to leave herd");
      
      toast({ title: "Success", description: "Left herd successfully" });
      onDelete?.(herd.id); // Refresh parent list
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>{herd.name}</CardTitle>
                <CardDescription>{herd.members.length} members</CardDescription>
            </div>
            <Users className="h-8 w-8 text-gray-300" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex -space-x-2 overflow-hidden">
            <TooltipProvider delayDuration={100}>
                {herd.members.map(member => (
                    <Tooltip key={member.id}>
                        <TooltipTrigger>
                            <Avatar className="border-2 border-white">
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{member.name}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isCreator ? (
          <>
            <HerdFormDialog
                herd={herd}
                onHerdCreated={() => onDelete?.(herd.id)} // Trigger refresh on edit (reuses onDelete for now as it just triggers fetch)
                trigger={
                    <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                }
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={handleLeave}
            disabled={isDeleting}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isDeleting ? "Leaving..." : "Leave Herd"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default HerdCard;