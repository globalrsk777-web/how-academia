"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { authStore } from "@/lib/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Mock data for demonstration
  const totalInstructors = 85;
  const instructorsChange = 5;
  const totalStudents = 12540;
  const studentsChange = 1200;
  const coursesOffered = 150;
  const coursesChange = 10;

  // Mock recent activity
  const recentActivity = [
    { user: "Dr. Evelyn Reed", role: "Instructor", action: 'Published "Modern Physics" course', date: "2 days ago" },
    { user: "Alex Johnson", role: "Student", action: 'Enrolled in "Modern Physics"', date: "1 day ago" },
    { user: "Admin", role: "Admin", action: "Updated institution profile", date: "5 hours ago" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Institution Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalInstructors}</div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +{instructorsChange} since last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +{studentsChange.toLocaleString()} from last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Offered</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{coursesOffered}</div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +{coursesChange} new courses this year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>An overview of recent activities in your institution.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <p className="text-muted-foreground">No recent activity</p>
                  </TableCell>
                </TableRow>
              ) : (
                recentActivity.map((activity, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{activity.user}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{activity.role}</span>
                    </TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell className="text-muted-foreground">{activity.date}</TableCell>
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
