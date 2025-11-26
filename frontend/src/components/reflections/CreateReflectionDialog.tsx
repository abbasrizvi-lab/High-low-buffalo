import { useContext, useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Connection, Herd } from "@/types";

export function CreateReflectionDialog() {
  const { user, session } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [highText, setHighText] = useState("");
  const [lowText, setLowText] = useState("");
  const [buffaloText, setBuffaloText] = useState("");
  const [highImage, setHighImage] = useState("");
  const [lowImage, setLowImage] = useState("");
  const [buffaloImage, setBuffaloImage] = useState("");
  const [audience, setAudience] = useState("self");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [herds, setHerds] = useState<Herd[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File, setter: (url: string) => void) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('reflections')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('reflections').getPublicUrl(filePath);
      setter(data.publicUrl);
      
      toast({ title: "Image uploaded", description: "Your image has been attached." });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (step === 2 && user && session) {
        setIsLoading(true);
        try {
          const headers = {
            'Authorization': `Bearer ${session.access_token}`,
          };
          const [connectionsRes, herdsRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/connections`, { headers }),
            fetch(`${import.meta.env.VITE_API_URL}/herds`, { headers }),
          ]);
          const connectionsData = await connectionsRes.json();
          const herdsData = await herdsRes.json();
          setConnections(connectionsData);
          setHerds(herdsData);
        } catch (error) {
          toast({
            title: "Error fetching data",
            description: "Could not load your connections and herds.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [step, user, session]);

  const handleShare = async () => {
    if (!user || !session) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to share a reflection.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const [audienceType, ...audienceIdParts] = audience.split("-");
      const audienceId = audienceIdParts.join('-');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/reflections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          high_text: highText,
          low_text: lowText,
          buffalo_text: buffaloText,
          high_image_url: highImage || null,
          low_image_url: lowImage || null,
          buffalo_image_url: buffaloImage || null,
          author_id: user.id,
          audience_type: audienceType,
          audience_id: audienceType === 'self' ? null : audienceId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to share reflection.");
      }

      toast({
        title: "Reflection Shared!",
        description: "Your High-Low-Buffalo has been shared.",
      });
      // Reset state and close dialog
      setStep(1);
      setHighText("");
      setLowText("");
      setBuffaloText("");
      setHighImage("");
      setLowImage("");
      setBuffaloImage("");
      setAudience("self");
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDialog = () => {
    setStep(1);
    setHighText("");
    setLowText("");
    setBuffaloText("");
    setHighImage("");
    setLowImage("");
    setBuffaloImage("");
    setAudience("self");
  };

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
          <Textarea id="high" placeholder="What was a great moment?" value={highText} onChange={(e) => setHighText(e.target.value)} />
          <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], setHighImage)} />
          {highImage && <p className="text-xs text-green-600">Image attached ✓</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="low" className="text-red-600">Low</Label>
          <Textarea id="low" placeholder="What was a challenging moment?" value={lowText} onChange={(e) => setLowText(e.target.value)} />
          <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], setLowImage)} />
          {lowImage && <p className="text-xs text-green-600">Image attached ✓</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="buffalo" className="text-blue-600">Buffalo</Label>
          <Textarea id="buffalo" placeholder="What was a surprising or random moment?" value={buffaloText} onChange={(e) => setBuffaloText(e.target.value)} />
          <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], setBuffaloImage)} />
          {buffaloImage && <p className="text-xs text-green-600">Image attached ✓</p>}
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => setStep(2)} disabled={isUploading || (!(highText || highImage) || !(lowText || lowImage) || !(buffaloText || buffaloImage))}>
          {isUploading ? "Uploading..." : "Next"}
        </Button>
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
        <Select onValueChange={setAudience} defaultValue={audience}>
          <SelectTrigger>
            <SelectValue placeholder="Select an audience" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : (
              <>
                <SelectItem value="self">Just for Me</SelectItem>
                {connections.map(c => <SelectItem key={c.id} value={`user-${c.id}`}>{c.username || c.email}</SelectItem>)}
                {herds.map(h => <SelectItem key={h.id} value={`herd-${h.id}`}>{h.name}</SelectItem>)}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
        <Button onClick={handleShare} disabled={isSubmitting}>{isSubmitting ? "Sharing..." : "Share Reflection"}</Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && resetDialog()}>
      <DialogTrigger asChild>
        <Button>Share your High-Low-Buffalo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {step === 1 ? renderStepOne() : renderStepTwo()}
      </DialogContent>
    </Dialog>
  );
}