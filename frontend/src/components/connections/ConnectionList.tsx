import { Connection } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, UserMinus, UserPlus, X } from "lucide-react";

interface ConnectionListProps {
  connections: Connection[];
  type: "accepted" | "pending";
  onAccept?: (connectionId: string) => void;
  onDecline?: (connectionId: string) => void;
  onRemove?: (connectionId: string) => void;
}

const ConnectionList = ({
  connections,
  type,
  onAccept,
  onDecline,
  onRemove,
}: ConnectionListProps) => {
  if (connections.length === 0) {
    return <p className="text-sm text-gray-500 mt-4">No connections found.</p>;
  }

  return (
    <ul className="space-y-3 mt-4">
      {connections.map((connection) => (
        <li
          key={connection.id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={connection.user?.avatarUrl}
                alt={connection.user?.name}
              />
              <AvatarFallback>{connection.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{connection.user?.name}</p>
              <p className="text-xs text-gray-500">{connection.user?.email}</p>
            </div>
          </div>
          {type === "accepted" ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => onRemove?.(connection.id)}
            >
              <UserMinus className="h-4 w-4 mr-2" />
              Remove
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => onAccept?.(connection.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => onDecline?.(connection.id)}
              >
                <X className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ConnectionList;