"use client";

import { AddStudentDialog } from "@/components/institution/AddStudentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authStore } from "@/lib/store/authStore";
import { UserPlus, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/store/authStore";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InstitutionStudentsPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const allStudents = await authStore.getUsersByRole("student");
        setStudents(allStudents);
      } catch (error) {
        console.error("Error loading students:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Mock students
  const mockStudents = [
    { id: "stud1", name: "Alex Johnson", email: "alex.j@example.com", role: "student" as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "stud2", name: "Maria Garcia", email: "maria.g@example.com", role: "student" as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "stud3", name: "Chen Wei", email: "chen.w@example.com", role: "student" as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "stud4", name: "Jane Doe", email: "jane.doe@example.com", role: "student" as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "stud5", name: "David Miller", email: "david.m@example.com", role: "student" as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  const displayStudents = students && students.length > 0 ? students : mockStudents;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading">Students</h1>
        </div>
        <AddStudentDialog />
      </div>

      {loading && students ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <UserPlus className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">No students yet. Add your first student!</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Student</DropdownMenuItem>
                            <DropdownMenuItem>View Courses</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove Student</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
