"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateExamDialog } from "@/components/instructor/CreateExamDialog";
import { where } from "@/lib/firebase/hooks";
import type { Exam } from "@/types";
import { FileText } from "lucide-react";

export default function InstructorExamsPage() {
  const { userProfile } = useAuth();
  const instructorId = userProfile?.id;

  const { data: exams, loading } = useCollection<Exam>(
    "exams",
    instructorId ? [where("instructorId", "==", instructorId)] : undefined
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Exams</h1>
          <p className="text-muted-foreground">Manage your exams</p>
        </div>
        <CreateExamDialog />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : exams && exams.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>{exam.title}</CardTitle>
                </div>
                <CardDescription>{exam.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Course: {exam.courseName || "Unknown"}
                  </p>
                  <p className="text-muted-foreground">
                    Duration: {exam.duration} minutes
                  </p>
                  <p className="text-muted-foreground">
                    Questions: {exam.questions?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No exams yet. Create your first exam!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

