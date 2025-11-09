"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { BookOpen, Users, FileText, TrendingUp } from "lucide-react";
import { where } from "@/lib/firebase/hooks";
import type { Course, Exam, ExamSubmission } from "@/types";

export default function InstructorDashboard() {
  const { userProfile } = useAuth();
  const instructorId = userProfile?.id;

  const { data: courses } = useCollection<Course>(
    "courses",
    instructorId ? [where("instructorId", "==", instructorId)] : undefined
  );

  const { data: exams } = useCollection<Exam>(
    "exams",
    instructorId ? [where("instructorId", "==", instructorId)] : undefined
  );

  const { data: submissions } = useCollection<ExamSubmission>("examSubmissions");

  // Calculate statistics
  const totalStudents = new Set(
    submissions
      ?.filter((s) => exams?.some((e) => e.id === s.examId))
      .map((s) => s.studentId)
  ).size || 0;

  const activeCourses = courses?.length || 0;
  const averageScore =
    submissions
      ?.filter((s) => exams?.some((e) => e.id === s.examId) && s.score !== undefined)
      .reduce((acc, s) => acc + (s.score || 0), 0) /
      (submissions?.filter((s) => exams?.some((e) => e.id === s.examId) && s.score !== undefined).length || 1) || 0;

  const recentSubmissions = submissions
    ?.filter((s) => exams?.some((e) => e.id === s.examId))
    .slice(-5)
    .reverse() || [];

  if (!courses || !exams || !submissions) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userProfile?.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Active students</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Courses created</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all exams</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Exams created</p>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            AI-Powered Analysis
          </CardTitle>
          <CardDescription>
            Get insights into student performance and course effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Use AI to analyze student performance, generate exam questions, and get personalized learning suggestions tailored for Ugandan students.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-background/50 rounded-md">
                <p className="font-medium">Performance Analysis</p>
                <p className="text-muted-foreground">Track student progress</p>
              </div>
              <div className="p-2 bg-background/50 rounded-md">
                <p className="font-medium">Question Generation</p>
                <p className="text-muted-foreground">AI-powered exam questions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Recent Exam Submissions</CardTitle>
          <CardDescription>Latest submissions from your students</CardDescription>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((submission) => {
                const exam = exams.find((e) => e.id === submission.examId);
                return (
                  <div 
                    key={submission.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{exam?.title || "Unknown Exam"}</p>
                      <p className="text-sm text-muted-foreground">
                        {submission.studentName || submission.studentId}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      {submission.score !== undefined ? (
                        <div>
                          <p className="font-semibold text-lg">{submission.score}%</p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Pending</p>
                          <p className="text-xs text-muted-foreground">Review</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

