"use client";

import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import type { Course } from "@/types";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function StudentCoursesPage() {
  const { data: courses, loading } = useCollection<Course>("courses");
  const { toast } = useToast();
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());

  const handleEnroll = async (courseId: string, courseTitle: string) => {
    // In a real app, you'd add enrollment to a enrollments collection
    setEnrolledCourses((prev) => new Set(prev).add(courseId));
    toast({
      title: "Enrolled Successfully! 🎓",
      description: `You have been enrolled in "${courseTitle}". Check your dashboard for updates.`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">My Courses</h1>
        <p className="text-muted-foreground">Browse and enroll in courses</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : courses && courses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <Card 
              key={course.id} 
              className="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="line-clamp-2 flex-1">{course.title}</CardTitle>
                </div>
                <CardDescription className="line-clamp-3 mt-2">
                  {course.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Instructor:
                    </p>
                    <p className="text-sm font-medium">
                      {course.instructorName || "Unknown"}
                    </p>
                  </div>
                  {enrolledCourses.has(course.id) ? (
                    <Button
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-500/10"
                      disabled
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Enrolled
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEnroll(course.id, course.title)}
                      className="w-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-md hover:shadow-lg"
                    >
                      Enroll Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No courses available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

