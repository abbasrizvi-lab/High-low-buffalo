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
import { mockConnections } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HerdFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Herd</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Herd</DialogTitle>
          <DialogDescription>
            Name your herd and select members from your connections.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Herd Name</Label>
            <Input id="name" placeholder="e.g., Family, Book Club" />
          </div>
          <div className="grid gap-2">
            <Label>Members</Label>
            <ScrollArea className="h-40 rounded-md border p-4">
                <div className="space-y-4">
                    {mockConnections.map(connection => (
                        <div key={connection.id} className="flex items-center space-x-2">
                            <Checkbox id={`conn-${connection.id}`} />
                            <Label htmlFor={`conn-${connection.id}`} className="font-normal">
                                {connection.user.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Herd</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}