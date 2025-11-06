"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockDb, type Course } from "@/lib/mock-data";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    
    const allCourses = await mockDb.getCourses();
    const studentCourses = await mockDb.getCourses({ studentId: currentUser.id });
    
    setCourses(allCourses);
    setEnrolledCourses(studentCourses);
  };

  const handleEnroll = async (courseId: string) => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    
    await mockDb.enrollInCourse(courseId, currentUser.id);
    loadCourses();
  };

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some((c) => c.id === courseId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">Browse and enroll in available courses</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Instructor: {course.instructorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.enrolledStudents?.length || 0} students enrolled
                  </p>
                </div>
                {isEnrolled(course.id) ? (
                  <Button variant="outline" className="w-full" disabled>
                    Enrolled
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleEnroll(course.id)}>
                    Enroll Now
                  </Button>
                )}
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

