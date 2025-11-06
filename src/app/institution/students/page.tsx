"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockDb, type User } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function InstitutionStudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    
    const institutionId = currentUser.institutionId || "inst1";
    const institutionStudents = await mockDb.getUsers({ role: "student", institutionId });
    setStudents(institutionStudents);
  };

  const handleCreateStudent = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser || !newStudent.email || !newStudent.name) return;

    const institutionId = currentUser.institutionId || "inst1";
    
    // Create student user
    await mockDb.signUp(newStudent.email, "password123", "student", newStudent.name);
    
    // Get the newly created user and update with institution
    const allStudents = await mockDb.getUsers({ role: "student" });
    const newStudentUser = allStudents.find((u) => u.email === newStudent.email);
    
    if (newStudentUser) {
      await mockDb.updateUser(newStudentUser.id, { institutionId });
    }

    setNewStudent({ name: "", email: "" });
    setIsDialogOpen(false);
    loadStudents();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Students</h1>
          <p className="text-muted-foreground">Manage students enrolled in your institution</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Create a new student account for your institution</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Alex Thompson"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="student@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateStudent}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <CardTitle>{student.name}</CardTitle>
              <CardDescription>{student.email}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        {students.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No students yet. Add your first student!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

