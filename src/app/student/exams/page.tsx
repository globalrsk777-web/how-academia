"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection, where } from "@/lib/firebase/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import type { Exam, ExamSubmission } from "@/types";
import { FileText, Eye, Play } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function StudentExamsPage() {
  const { userProfile } = useAuth();
  const studentId = userProfile?.id;

  const { data: exams, loading: examsLoading } = useCollection<Exam>("exams");
  const { data: submissions } = useCollection<ExamSubmission>(
    "examSubmissions",
    studentId ? [where("studentId", "==", studentId)] : undefined
  );

  // Mock exams data
  const mockExams = [
    { id: "1", title: "Physics Midterm", status: "Graded" as const },
    { id: "2", title: "History Pop Quiz", status: "Graded" as const },
    { id: "3", title: "Algebra II Final", status: "In Progress" as const },
    { id: "4", title: "Art History Paper", status: "Pending" as const },
  ];

  const hasSubmission = (examId: string) => {
    return submissions?.some((s) => s.examId === examId);
  };

  const getExamStatus = (examId: string): "Graded" | "In Progress" | "Pending" => {
    if (hasSubmission(examId)) {
      const submission = submissions?.find((s) => s.examId === examId);
      if (submission?.score !== undefined) {
        return "Graded";
      }
      return "In Progress";
    }
    return "Pending";
  };

  const displayExams = exams && exams.length > 0 
    ? exams.map(exam => ({
        id: exam.id,
        title: exam.title,
        status: getExamStatus(exam.id),
      }))
    : mockExams;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Graded":
        return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">Graded</Badge>;
      case "In Progress":
        return <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">In Progress</Badge>;
      case "Pending":
        return <Badge className="bg-gray-500/10 text-gray-600 dark:text-gray-400">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">My Exams</h1>
      </div>

      {examsLoading && exams ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Exam List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayExams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No exams available</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.title}</TableCell>
                      <TableCell>{getStatusBadge(exam.status)}</TableCell>
                      <TableCell className="text-right">
                        {exam.status === "Graded" ? (
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Results
                          </Button>
                        ) : (
                          <Button size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            Start Exam
                          </Button>
                        )}
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
