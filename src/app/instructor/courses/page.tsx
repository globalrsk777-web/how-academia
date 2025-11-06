"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockDb, type Course } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    const instructorCourses = await mockDb.getCourses({ instructorId: currentUser.id });
    setCourses(instructorCourses);
  };

  const handleCreateCourse = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser || !newCourse.title) return;

    const institutionId = currentUser.institutionId || "inst1";
    await mockDb.createCourse({
      title: newCourse.title,
      description: newCourse.description,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      institutionId,
      enrolledStudents: [],
    });

    setNewCourse({ title: "", description: "" });
    setIsDialogOpen(false);
    loadCourses();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">Manage your courses and track student enrollments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new course to your teaching portfolio</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Introduction to Web Development"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Course description..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCourse}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {course.enrolledStudents?.length || 0} students enrolled
              </p>
            </CardContent>
          </Card>
        ))}
        {courses.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No courses yet. Create your first course!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

