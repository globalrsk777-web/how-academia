"use client";

import { AddStudentDialog } from "@/components/institution/AddStudentDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authStore } from "@/lib/store/authStore";
import { UserPlus, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/store/authStore";

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Students</h1>
          <p className="text-muted-foreground">Manage students</p>
        </div>
        <AddStudentDialog />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : students && students.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card key={student.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{student.name}</CardTitle>
                    <CardDescription>{student.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {student.bio && (
                  <p className="text-sm text-muted-foreground">{student.bio}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No students yet. Add your first student!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

