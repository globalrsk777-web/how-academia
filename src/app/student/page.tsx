"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb } from "@/lib/mock-data";
import { BookOpen, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    averageScore: 0,
    mainCourses: [] as any[],
  });

  useEffect(() => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;

    const loadDashboard = async () => {
      const courses = await mockDb.getCourses({ studentId: currentUser.id });
      const submissions = await mockDb.getExamSubmissions({ studentId: currentUser.id });

      // Calculate average score
      const scores = submissions.map((s) => (s.score / s.totalPoints) * 100);
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      setStats({
        enrolledCourses: courses.length,
        averageScore: Math.round(averageScore),
        mainCourses: courses.slice(0, 3),
      });
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your learning overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Across all exams</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Main Courses</CardTitle>
          <CardDescription>Your enrolled courses</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.mainCourses.length > 0 ? (
            <div className="space-y-4">
              {stats.mainCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">Instructor: {course.instructorName}</p>
                  </div>
                  <Link href="/student/courses">
                    <Button variant="outline">View Course</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No enrolled courses yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

