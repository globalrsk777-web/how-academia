"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { authStore } from "@/lib/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

export default function InstitutionDashboard() {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    instructors: 0,
    students: 0,
    courses: 0,
  });
  const [loading, setLoading] = useState(true);

  const { data: courses } = useCollection("courses");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const instructors = await authStore.getUsersByRole("instructor");
        const students = await authStore.getUsersByRole("student");
        setStats({
          instructors: instructors.length,
          students: students.length,
          courses: courses?.length || 0,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [courses]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userProfile?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.instructors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Offered</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.courses}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

