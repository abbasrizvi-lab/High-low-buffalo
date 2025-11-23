import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockConnections, mockHerds } from "@/lib/mock-data";

export function CreateReflectionDialog() {
  const [step, setStep] = useState(1);

  const renderStepOne = () => (
    <>
      <DialogHeader>
        <DialogTitle>Share your High-Low-Buffalo</DialogTitle>
        <DialogDescription>
          Take a moment to reflect on your day. What stood out?
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="high" className="text-green-600">High</Label>
          <Textarea id="high" placeholder="What was a great moment?" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="low" className="text-red-600">Low</Label>
          <Textarea id="low" placeholder="What was a challenging moment?" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="buffalo" className="text-blue-600">Buffalo</Label>
          <Textarea id="buffalo" placeholder="What was a surprising or random moment?" />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => setStep(2)}>Next</Button>
      </DialogFooter>
    </>
  );

  const renderStepTwo = () => (
    <>
      <DialogHeader>
        <DialogTitle>Share with...</DialogTitle>
        <DialogDescription>
          Choose who you want to share this reflection with.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="self">Just for Me</SelectItem>
            {mockConnections.map(c => <SelectItem key={c.id} value={`user-${c.user.id}`}>{c.user.name}</SelectItem>)}
            {mockHerds.map(h => <SelectItem key={h.id} value={`herd-${h.id}`}>{h.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
        <Button>Share Reflection</Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog onOpenChange={() => setStep(1)}>
      <DialogTrigger asChild>
        <Button>Share your High-Low-Buffalo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {step === 1 ? renderStepOne() : renderStepTwo()}
      </DialogContent>
    </Dialog>
  );
}