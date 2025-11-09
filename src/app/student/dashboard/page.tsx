"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, TrendingUp } from "lucide-react";
import { where } from "@/lib/firebase/hooks";
import type { Course, ExamSubmission } from "@/types";

export default function StudentDashboard() {
  const { userProfile } = useAuth();
  const studentId = userProfile?.id;

  // For now, we'll show all courses. In a real app, you'd track enrollments
  const { data: courses } = useCollection<Course>("courses");

  const { data: submissions } = useCollection<ExamSubmission>(
    "examSubmissions",
    studentId ? [where("studentId", "==", studentId)] : undefined
  );

  // Calculate statistics
  const enrolledCourses = courses?.length || 0; // Simplified - in real app, check enrollment collection
  const averageScore =
    submissions
      ?.filter((s) => s.score !== undefined)
      .reduce((acc, s) => acc + (s.score || 0), 0) /
      (submissions?.filter((s) => s.score !== undefined).length || 1) || 0;

  const mainCourses = courses?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userProfile?.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{enrolledCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Active courses</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: "50ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {averageScore >= 70 ? "Excellent!" : averageScore >= 50 ? "Good progress" : "Keep studying"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exams Taken</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{submissions?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total submissions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>My Main Courses</CardTitle>
          <CardDescription>Your active courses from Ugandan institutions</CardDescription>
        </CardHeader>
        <CardContent>
          {mainCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">No courses enrolled yet</p>
              <p className="text-xs text-muted-foreground mt-2">Browse courses to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mainCourses.map((course, index) => (
                <div 
                  key={course.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors duration-200 animate-fade-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Instructor: {course.instructorName || "Unknown Instructor"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

