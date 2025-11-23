import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

const InviteConnectionForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite a Connection</CardTitle>
        <CardDescription>
          Enter the email of the person you want to connect with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="friend@example.com" />
          </div>
          <Button type="submit">
            <PlusCircle className="h-4 w-4 mr-2" />
            Send Invite
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InviteConnectionForm;