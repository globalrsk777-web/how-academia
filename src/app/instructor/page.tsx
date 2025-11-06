"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb } from "@/lib/mock-data";
import { Users, BookOpen, TrendingUp, Sparkles } from "lucide-react";

export default function InstructorDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    averageScore: 0,
    recentSubmissions: [] as any[],
  });

  useEffect(() => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;

    const loadDashboard = async () => {
      const courses = await mockDb.getCourses({ instructorId: currentUser.id });
      const exams = await mockDb.getExams({ instructorId: currentUser.id });
      const submissions = await mockDb.getExamSubmissions({ instructorId: currentUser.id });

      // Calculate total students across all courses
      const enrolledStudents = new Set<string>();
      courses.forEach((course) => {
        course.enrolledStudents?.forEach((id) => enrolledStudents.add(id));
      });

      // Calculate average score
      const scores = submissions.map((s) => (s.score / s.totalPoints) * 100);
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      setStats({
        totalStudents: enrolledStudents.size,
        activeCourses: courses.length,
        averageScore: Math.round(averageScore),
        recentSubmissions: submissions.slice(0, 5),
      });
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Instructor Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your teaching activities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">Courses you're teaching</p>
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

        <Card className="border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI-Powered Analysis</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Generate exam questions, analyze performance, and get personalized insights
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exam Submissions</CardTitle>
          <CardDescription>Latest exam submissions from your students</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {stats.recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{submission.studentName}</p>
                    <p className="text-sm text-muted-foreground">Submitted {new Date(submission.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{submission.score}/{submission.totalPoints}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((submission.score / submission.totalPoints) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No recent submissions</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

