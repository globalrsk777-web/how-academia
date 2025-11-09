"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCourseDialog } from "@/components/instructor/CreateCourseDialog";
import { LoadingSpinner } from "@/components/ui/loading";
import { where } from "@/lib/firebase/hooks";
import type { Course } from "@/types";
import { BookOpen } from "lucide-react";

export default function InstructorCoursesPage() {
  const { userProfile } = useAuth();
  const instructorId = userProfile?.id;

  const { data: courses, loading } = useCollection<Course>(
    "courses",
    instructorId ? [where("instructorId", "==", instructorId)] : undefined
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Courses</h1>
          <p className="text-muted-foreground">Manage your courses</p>
        </div>
        <CreateCourseDialog />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : courses && courses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <Card 
              key={course.id}
              className="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {course.description || "No description"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {new Date(course.createdAt).toLocaleDateString("en-UG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Instructor: <span className="font-medium">{course.instructorName || "You"}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No courses yet</p>
            <p className="text-sm text-muted-foreground text-center">
              Create your first course to start teaching students across Uganda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

