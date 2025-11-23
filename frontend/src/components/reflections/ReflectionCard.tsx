import { Reflection, User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface ReflectionCardProps {
  reflection: Reflection;
  currentUser: User;
}

const ReflectionCard = ({ reflection, currentUser }: ReflectionCardProps) => {
  const isOwnReflection = reflection.author.id === currentUser.id;
  const hasReacted = reflection.reactions.some(r => r.userId === currentUser.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={reflection.author.avatarUrl} alt={reflection.author.name} />
            <AvatarFallback>{reflection.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{reflection.author.name}</CardTitle>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(reflection.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-green-600">High</h4>
          <p className="text-gray-700">{reflection.highText}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-red-600">Low</h4>
          <p className="text-gray-700">{reflection.lowText}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-blue-600">Buffalo</h4>
          <p className="text-gray-700">{reflection.buffaloText}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {!isOwnReflection && (
          <Button variant={hasReacted ? "secondary" : "ghost"} size="sm">
            <MessageSquareQuote className="h-4 w-4 mr-2" />
            {hasReacted ? "Curious!" : "Curious?"}
          </Button>
        )}
        {isOwnReflection && (
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReflectionCard;