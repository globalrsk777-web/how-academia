"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb } from "@/lib/mock-data";
import { Users, BookOpen, GraduationCap } from "lucide-react";

export default function InstitutionDashboard() {
  const [stats, setStats] = useState({
    totalInstructors: 0,
    totalStudents: 0,
    totalCourses: 0,
  });

  useEffect(() => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;

    const loadDashboard = async () => {
      const institutionId = currentUser.institutionId || "inst1";
      
      const instructors = await mockDb.getUsers({ role: "instructor", institutionId });
      const students = await mockDb.getUsers({ role: "student", institutionId });
      const courses = await mockDb.getCourses();

      setStats({
        totalInstructors: instructors.length,
        totalStudents: students.length,
        totalCourses: courses.length,
      });
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Institution Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your institution.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInstructors}</div>
            <p className="text-xs text-muted-foreground">Active instructors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Offered</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

