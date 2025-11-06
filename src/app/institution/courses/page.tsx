"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb, type Course } from "@/lib/mock-data";

export default function InstitutionCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const allCourses = await mockDb.getCourses();
    setCourses(allCourses);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Courses</h1>
        <p className="text-muted-foreground">All courses offered by instructors within your institution</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Instructor: {course.instructorName}</p>
                <p className="text-sm text-muted-foreground">
                  {course.enrolledStudents?.length || 0} students enrolled
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {courses.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No courses available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

