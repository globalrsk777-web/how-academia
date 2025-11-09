"use client";

import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Course } from "@/types";
import { BookOpen } from "lucide-react";

export default function InstitutionCoursesPage() {
  const { data: courses, loading } = useCollection<Course>("courses");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">Courses</h1>
        <p className="text-muted-foreground">All courses offered by instructors</p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : courses && courses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>{course.title}</CardTitle>
                </div>
                <CardDescription>{course.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Instructor: {course.instructorName || "Unknown"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No courses available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

