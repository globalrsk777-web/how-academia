"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockDb, type Exam, type Course } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function InstructorExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    courseId: "",
    duration: 60,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    const instructorExams = await mockDb.getExams({ instructorId: currentUser.id });
    const instructorCourses = await mockDb.getCourses({ instructorId: currentUser.id });
    setExams(instructorExams);
    setCourses(instructorCourses);
  };

  const handleCreateExam = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser || !newExam.title || !newExam.courseId) return;

    const course = courses.find((c) => c.id === newExam.courseId);
    if (!course) return;

    await mockDb.createExam({
      title: newExam.title,
      description: newExam.description,
      courseId: newExam.courseId,
      courseName: course.title,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      duration: newExam.duration,
      questions: [], // Empty questions array for now
    });

    setNewExam({ title: "", description: "", courseId: "", duration: 60 });
    setIsDialogOpen(false);
    loadData();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">My Exams</h1>
          <p className="text-muted-foreground">Create and manage exams for your courses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
              <DialogDescription>Add a new exam to one of your courses</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Exam Title</Label>
                <Input
                  id="title"
                  value={newExam.title}
                  onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  placeholder="Midterm Exam"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newExam.description}
                  onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                  placeholder="Exam description..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select value={newExam.courseId} onValueChange={(value) => setNewExam({ ...newExam, courseId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newExam.duration}
                  onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) || 60 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateExam}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader>
              <CardTitle>{exam.title}</CardTitle>
              <CardDescription>{exam.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Course: {exam.courseName}</p>
                <p className="text-sm text-muted-foreground">Duration: {exam.duration} minutes</p>
                <p className="text-sm text-muted-foreground">Questions: {exam.questions.length}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {exams.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No exams yet. Create your first exam!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

