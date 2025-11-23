import { Herd, User } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, LogOut, Trash2, Users } from "lucide-react";

interface HerdCardProps {
  herd: Herd;
  currentUser: User;
}

const HerdCard = ({ herd, currentUser }: HerdCardProps) => {
  const isCreator = herd.creatorId === currentUser.id;

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
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            Leave Herd
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default HerdCard;