"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { BookOpen, Users, TrendingUp, Sparkles } from "lucide-react";
import { where } from "@/lib/firebase/hooks";
import type { Course, Exam, ExamSubmission } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Mock data for demonstration
  const totalStudents = 1234;
  const studentsChange = 20.1;
  const activeCourses = 42;
  const coursesChange = 12;
  const averageScore = 88.5;
  const scoreChange = 2.5;

  // Mock recent assessments
  const recentAssessments = [
    { student: "Alex Johnson", exam: "Physics Midterm", score: 95 },
    { student: "Maria Garcia", exam: "Physics Midterm", score: 98 },
    { student: "Chen Wei", exam: "History Pop Quiz", score: 78 },
    { student: "David Miller", exam: "History Pop Quiz", score: 62 },
  ];

  // Mock engagement data for chart (Jan-Dec)
  const engagementData = [1200, 1800, 2400, 3000, 3600, 4200, 3800, 4500, 4800, 5200, 5600, 5800];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +{studentsChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCourses}</div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +{coursesChange} since last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +{scoreChange}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Analysis */}
      <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Analysis
          </CardTitle>
          <CardDescription>Get insights on student performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="hover:scale-105 active:scale-95 transition-transform duration-200">
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze Now
          </Button>
        </CardContent>
      </Card>

      {/* Student Engagement Chart */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Student Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Y-axis labels on the left */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-muted-foreground pr-2">
              <span>6k</span>
              <span>4.5k</span>
              <span>3k</span>
              <span>1.5k</span>
              <span>0k</span>
            </div>
            {/* Chart Area */}
            <div className="ml-8 h-64 flex items-end justify-between gap-1 pr-4">
              {engagementData.map((value, index) => {
                const height = (value / 6000) * 100;
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="relative w-full h-full flex items-end">
                      <div 
                        className="w-full bg-primary rounded-t hover:bg-primary/80 transition-all duration-200 cursor-pointer group-hover:opacity-80"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                        title={`${months[index]}: ${(value / 1000).toFixed(1)}k`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium mt-1">{months[index]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Assessments */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>An overview of recently graded exams.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAssessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <p className="text-muted-foreground">No assessments yet</p>
                  </TableCell>
                </TableRow>
              ) : (
                recentAssessments.map((assessment, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{assessment.student}</TableCell>
                    <TableCell>{assessment.exam}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${
                        assessment.score >= 90 ? 'text-green-600 dark:text-green-400' :
                        assessment.score >= 70 ? 'text-blue-600 dark:text-blue-400' :
                        assessment.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {assessment.score}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
