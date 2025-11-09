"use client";

import { useState } from "react";
import { authStore } from "@/lib/store/authStore";
import { dataStore } from "@/lib/store/dataStore";
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

export function AddInstructorDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [subject, setSubject] = useState("");
  const [pricePerSession, setPricePerSession] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    try {
      const user = await authStore.createUserWithEmailAndPassword(email, password, "instructor");
      const profile = authStore.getCurrentUserProfile();
      
      if (profile) {
        await dataStore.addDocument("users", {
          ...profile,
          name,
          bio,
          subject: subject || undefined,
          pricePerSession: pricePerSession ? parseInt(pricePerSession) : undefined,
        });
        
        // Update in authStore
        await authStore.updateUserProfile(user.uid, { 
          name, 
          bio,
          subject: subject || undefined,
          pricePerSession: pricePerSession ? parseInt(pricePerSession) : undefined,
        });
      }
      
      setName("");
      setEmail("");
      setPassword("");
      setBio("");
      setSubject("");
      setPricePerSession("");
      setOpen(false);
      toast({
        title: "Instructor Added! 👨‍🏫",
        description: `${name} has been successfully added as an instructor.`,
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error creating instructor:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create instructor. User may already exist.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Instructor</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Instructor</DialogTitle>
            <DialogDescription>
              Create a new instructor account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Dr. Nakato Mary or Prof. Kigozi James"
                required
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nakato.mary@mak.ac.ug"
                required
                className="transition-all duration-200 focus:scale-[1.01]"
              />
              <p className="text-xs text-muted-foreground">Use institutional email if available</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password (min. 6 characters)"
                required
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g., Experienced lecturer in Agriculture with 10+ years teaching at Makerere University. Specializes in crop management and soil science..."
                rows={3}
                className="transition-all duration-200 focus:scale-[1.01] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Specialization (Optional)</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Agriculture, Mathematics, Luganda Language"
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price per Session in UGX (Optional)</Label>
              <Input
                id="price"
                type="number"
                value={pricePerSession}
                onChange={(e) => setPricePerSession(e.target.value)}
                placeholder="e.g., 50000"
                min="0"
                className="transition-all duration-200 focus:scale-[1.01]"
              />
              <p className="text-xs text-muted-foreground">Leave empty if pricing is flexible</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                "Create Instructor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

