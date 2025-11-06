"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockDb, type Session, type Course } from "@/lib/mock-data";
import { Plus, Calendar } from "lucide-react";

export default function InstructorSchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    courseId: "",
    scheduledAt: "",
    duration: 60,
    maxParticipants: 30,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    const instructorSessions = await mockDb.getSessions({ instructorId: currentUser.id });
    const instructorCourses = await mockDb.getCourses({ instructorId: currentUser.id });
    setSessions(instructorSessions);
    setCourses(instructorCourses);
  };

  const handleCreateSession = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser || !newSession.title) return;

    const course = courses.find((c) => c.id === newSession.courseId);

    await mockDb.createSession({
      title: newSession.title,
      description: newSession.description,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      courseId: newSession.courseId || undefined,
      scheduledAt: newSession.scheduledAt || new Date().toISOString(),
      duration: newSession.duration,
      maxParticipants: newSession.maxParticipants,
      participants: [],
    });

    setNewSession({
      title: "",
      description: "",
      courseId: "",
      scheduledAt: "",
      duration: 60,
      maxParticipants: 30,
    });
    setIsDialogOpen(false);
    loadData();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Schedule</h1>
          <p className="text-muted-foreground">Manage your live coaching sessions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Session</DialogTitle>
              <DialogDescription>Schedule a new live coaching session</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title</Label>
                <Input
                  id="title"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  placeholder="Live Coding Session"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  placeholder="Session description..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course (Optional)</Label>
                <Select value={newSession.courseId} onValueChange={(value) => setNewSession({ ...newSession, courseId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Scheduled Date & Time</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={newSession.scheduledAt}
                  onChange={(e) => setNewSession({ ...newSession, scheduledAt: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) || 60 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newSession.maxParticipants}
                    onChange={(e) => setNewSession({ ...newSession, maxParticipants: parseInt(e.target.value) || 30 })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSession}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
              <CardDescription>{session.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(session.scheduledAt).toLocaleString()}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Duration: {session.duration} minutes
                </span>
                <span className="text-sm text-muted-foreground">
                  Participants: {session.participants.length}/{session.maxParticipants}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {sessions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No scheduled sessions yet. Create your first session!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

