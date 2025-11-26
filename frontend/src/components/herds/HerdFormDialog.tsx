import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuthContext } from "@/contexts/AuthContext";
import { Connection, Herd } from "@/types";
import { toast } from "@/hooks/use-toast";

interface HerdFormDialogProps {
  onHerdCreated?: () => void;
  herd?: Herd;
  trigger?: React.ReactNode;
}

export function HerdFormDialog({ onHerdCreated, herd, trigger }: HerdFormDialogProps) {
  const { user, session } = useContext(AuthContext);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [herdName, setHerdName] = useState(herd?.name || "");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    herd?.members.map(m => m.id) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchConnections = async () => {
      if (user && session) {
        setIsLoading(true);
        try {
          const headers = {
            'Authorization': `Bearer ${session.access_token}`,
          };
          const response = await fetch(`${import.meta.env.VITE_API_URL}/connections`, { headers });
          const data = await response.json();
          setConnections(data);
        } catch (error) {
          toast({
            title: "Error fetching connections",
            description: "Could not load your connections.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchConnections();
  }, [user, session]);

  const handleMemberToggle = (connectionId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedMembers(prev => [...prev, connectionId]);
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== connectionId));
    }
  };

  const handleCreateHerd = async () => {
    if (!herdName.trim()) {
        toast({ title: "Error", description: "Please enter a herd name.", variant: "destructive" });
        return;
    }
    if (selectedMembers.length === 0) {
        toast({ title: "Error", description: "Please select at least one member.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
        const url = herd
            ? `${import.meta.env.VITE_API_URL}/herds/${herd.id}`
            : `${import.meta.env.VITE_API_URL}/herds`;
        
        const method = herd ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
                name: herdName,
                members: selectedMembers
            })
        });

        if (!response.ok) throw new Error(herd ? "Failed to update herd" : "Failed to create herd");

        toast({ title: "Success", description: herd ? "Herd updated successfully!" : "Herd created successfully!" });
        if (!herd) {
            setHerdName("");
            setSelectedMembers([]);
        }
        onHerdCreated?.();
        setOpen(false);
    } catch (error) {
        toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Create New Herd</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{herd ? "Edit Herd" : "Create a Herd"}</DialogTitle>
          <DialogDescription>
            {herd ? "Update your herd's name and members." : "Name your herd and select members from your connections."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Herd Name</Label>
            <Input 
                id="name" 
                placeholder="e.g., Family, Book Club" 
                value={herdName}
                onChange={(e) => setHerdName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Members</Label>
            <ScrollArea className="h-40 rounded-md border p-4">
                <div className="space-y-4">
                    {isLoading ? (
                      <p>Loading connections...</p>
                    ) : (
                      connections.map(connection => (
                          <div key={connection.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`conn-${connection.id}`} 
                                checked={selectedMembers.includes(connection.id)}
                                onCheckedChange={(checked) => handleMemberToggle(connection.id, checked as boolean)}
                              />
                              <Label htmlFor={`conn-${connection.id}`} className="font-normal">
                                  {connection.username || connection.email}
                              </Label>
                          </div>
                      ))
                    )}
                </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateHerd} disabled={isSubmitting}>
            {isSubmitting ? (herd ? "Saving..." : "Creating...") : "Save Herd"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}