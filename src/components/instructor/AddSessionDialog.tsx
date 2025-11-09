"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { addDocumentNonBlocking } from "@/lib/firebase/hooks";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddSessionDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startTime || !endTime || !userProfile) return;

    setLoading(true);
    try {
      await addDocumentNonBlocking("schedule", {
        title,
        description,
        instructorId: userProfile.id,
        instructorName: userProfile.name,
        startTime,
        endTime,
      });
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setOpen(false);
      toast({
        title: "Session Scheduled! 📅",
        description: `"${title}" has been added to your schedule.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to schedule session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Session</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Live Session</DialogTitle>
            <DialogDescription>
              Schedule a new live coaching session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Live Coaching: Agricultural Best Practices"
                required
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what will be covered in this session. Example: Interactive session on modern farming techniques, Q&A on crop management..."
                rows={3}
                className="transition-all duration-200 focus:scale-[1.01] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time (EAT - East Africa Time)</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="transition-all duration-200 focus:scale-[1.01]"
              />
              <p className="text-xs text-muted-foreground">Time zone: UTC+3 (Kampala, Uganda)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time (EAT - East Africa Time)</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

