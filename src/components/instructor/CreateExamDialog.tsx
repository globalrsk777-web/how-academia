"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { where } from "@/lib/firebase/hooks";
import type { Course } from "@/types";

export function CreateExamDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [duration, setDuration] = useState("60");
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const instructorId = userProfile?.id;

  const { data: courses } = useCollection<Course>(
    "courses",
    instructorId ? [where("instructorId", "==", instructorId)] : undefined
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId || !userProfile) return;

    setLoading(true);
    try {
      await addDocumentNonBlocking("exams", {
        title,
        description,
        courseId,
        courseName: courses?.find((c) => c.id === courseId)?.title,
        instructorId: userProfile.id,
        instructorName: userProfile.name,
        questions: [],
        duration: parseInt(duration),
      });
      setTitle("");
      setDescription("");
      setCourseId("");
      setDuration("60");
      setOpen(false);
      toast({
        title: "Exam Created! 📝",
        description: `"${title}" has been successfully created. You can now add questions.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating exam:", error);
      toast({
        title: "Error",
        description: "Failed to create exam. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Exam</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
            <DialogDescription>
              Add a new exam for your course
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Midterm Exam - Agriculture Fundamentals"
                required
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select value={courseId} onValueChange={setCourseId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the exam scope and topics covered. Example: This exam covers crop management, soil science, and agricultural economics..."
                rows={3}
                className="transition-all duration-200 focus:scale-[1.01] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                placeholder="60"
                required
                className="transition-all duration-200 focus:scale-[1.01]"
              />
              <p className="text-xs text-muted-foreground">Recommended: 60-120 minutes for comprehensive exams</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Exam"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

