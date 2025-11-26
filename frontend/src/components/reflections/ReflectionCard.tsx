import { Reflection, User, Connection, Herd } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, Trash2, Lock, Users } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ReflectionCardProps {
  reflection: Reflection;
  currentUser: User;
  onDelete?: (id: string) => void;
  token?: string;
  connections?: Connection[];
  herds?: Herd[];
}

const ReflectionCard = ({ reflection, currentUser, onDelete, token, connections = [], herds = [] }: ReflectionCardProps) => {
  const isOwnReflection = reflection.author_id === currentUser.id;
  const hasReacted = reflection.reactions?.some(r => r.userId === currentUser.id) ?? false;
  const [isDeleting, setIsDeleting] = useState(false);

  const getSharedWithText = () => {
    if (reflection.audience_type === 'self') return { text: 'Private', icon: Lock };
    if (reflection.audience_type === 'user') {
      const connection = connections.find(c => c.id === reflection.audience_id); // Note: audience_id for user type is user_id, not connection_id. Let's fix this assumption if needed or map correctly.
      // Actually, earlier in CreateReflectionDialog we saved audience_id as the ID from the select value.
      // The select value for user was `user-${c.id}` where c.id is connection ID? No, let's check CreateReflectionDialog.
      // It was `user-${c.id}` where `c` is the connection object. Wait, let's verify if we stored connection ID or User ID.
      // backend/routes/reflections.js saves what is sent.
      // CreateReflectionDialog sent `audienceId`.
      // In CreateReflectionDialog: `connections.map(c => <SelectItem key={c.id} value={user-${c.id}}>`
      // So audience_id is the CONNECTION ID.
      // So we find connection by ID.
      return { text: `Shared with ${connection?.username || connection?.email || 'Connection'}`, icon: Users };
    }
    if (reflection.audience_type === 'herd') {
        const herd = herds.find(h => h.id === reflection.audience_id);
        return { text: `Shared with ${herd?.name || 'Herd'}`, icon: Users };
    }
    return { text: 'Shared', icon: Users };
  };

  const { text: sharedText, icon: SharedIcon } = getSharedWithText();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this reflection?")) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reflections/${reflection.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete");
      
      toast({ title: "Deleted", description: "Reflection deleted successfully" });
      onDelete?.(reflection.id);
    } catch (error) {
      toast({ title: "Error", description: "Could not delete reflection", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Resolve author display name: try name -> username -> email -> "Unknown"
  const authorName = reflection.author?.name || reflection.author?.username || reflection.author?.email || "Unknown Author";
  const authorAvatar = reflection.author?.avatarUrl;
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={authorAvatar} alt={authorName} />
            <AvatarFallback>{authorInitial}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-base font-medium leading-none">{authorName}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(reflection.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3 pt-0">
        <div className="space-y-1.5 p-3 bg-green-50/50 rounded-lg border border-green-100 flex flex-col">
          <h4 className="font-semibold text-sm text-green-700 flex items-center gap-2">
            <span className="text-lg">🏔️</span> High
          </h4>
          {reflection.high_image_url && (
            <img src={reflection.high_image_url} alt="High" className="rounded-md object-cover w-full h-32 mb-2" />
          )}
          {reflection.high_text && <p className="text-sm text-gray-800 leading-relaxed">{reflection.high_text}</p>}
        </div>
        <div className="space-y-1.5 p-3 bg-red-50/50 rounded-lg border border-red-100 flex flex-col">
          <h4 className="font-semibold text-sm text-red-700 flex items-center gap-2">
            <span className="text-lg">🌵</span> Low
          </h4>
          {reflection.low_image_url && (
            <img src={reflection.low_image_url} alt="Low" className="rounded-md object-cover w-full h-32 mb-2" />
          )}
          {reflection.low_text && <p className="text-sm text-gray-800 leading-relaxed">{reflection.low_text}</p>}
        </div>
        <div className="space-y-1.5 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex flex-col">
          <h4 className="font-semibold text-sm text-blue-700 flex items-center gap-2">
            <span className="text-lg">🦬</span> Buffalo
          </h4>
          {reflection.buffalo_image_url && (
            <img src={reflection.buffalo_image_url} alt="Buffalo" className="rounded-md object-cover w-full h-32 mb-2" />
          )}
          {reflection.buffalo_text && <p className="text-sm text-gray-800 leading-relaxed">{reflection.buffalo_text}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t bg-gray-50/30">
        <div className="flex items-center text-xs text-muted-foreground gap-1">
            <SharedIcon className="h-3 w-3" />
            <span>{sharedText}</span>
        </div>
        <div className="flex gap-2">
            {!isOwnReflection && (
            <Button variant={hasReacted ? "secondary" : "ghost"} size="sm">
                <MessageSquareQuote className="h-4 w-4 mr-2" />
                {hasReacted ? "Curious!" : "Curious?"}
            </Button>
            )}
            {isOwnReflection && (
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
            )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReflectionCard;