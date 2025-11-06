"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockDb, type User } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function InstitutionInstructorsPage() {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    email: "",
    bio: "",
    subjectSpecialization: "",
    pricePerSession: 0,
  });

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    
    const institutionId = currentUser.institutionId || "inst1";
    const institutionInstructors = await mockDb.getUsers({ role: "instructor", institutionId });
    setInstructors(institutionInstructors);
  };

  const handleCreateInstructor = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser || !newInstructor.email || !newInstructor.name) return;

    const institutionId = currentUser.institutionId || "inst1";
    
    // Create instructor user
    await mockDb.signUp(newInstructor.email, "password123", "instructor", newInstructor.name);
    
    // Get the newly created user and update with bio and institution
    const allInstructors = await mockDb.getUsers({ role: "instructor" });
    const newInstructorUser = allInstructors.find((u) => u.email === newInstructor.email);
    
    if (newInstructorUser) {
      await mockDb.updateUser(newInstructorUser.id, {
        bio: newInstructor.bio,
        institutionId,
        subjectSpecialization: newInstructor.subjectSpecialization || undefined,
        pricePerSession: newInstructor.pricePerSession || undefined,
      });
    }

    setNewInstructor({ name: "", email: "", bio: "", subjectSpecialization: "", pricePerSession: 0 });
    setIsDialogOpen(false);
    loadInstructors();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Instructors</h1>
          <p className="text-muted-foreground">Manage instructors associated with your institution</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Instructor</DialogTitle>
              <DialogDescription>Create a new instructor account for your institution</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newInstructor.name}
                  onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                  placeholder="Dr. Sarah Johnson"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newInstructor.email}
                  onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                  placeholder="instructor@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={newInstructor.bio}
                  onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                  placeholder="Instructor bio..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectSpecialization">Subject Specialization</Label>
                <Input
                  id="subjectSpecialization"
                  value={newInstructor.subjectSpecialization}
                  onChange={(e) => setNewInstructor({ ...newInstructor, subjectSpecialization: e.target.value })}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerSession">Price per Session ($)</Label>
                <Input
                  id="pricePerSession"
                  type="number"
                  value={newInstructor.pricePerSession}
                  onChange={(e) => setNewInstructor({ ...newInstructor, pricePerSession: parseFloat(e.target.value) || 0 })}
                  placeholder="50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInstructor}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instructors.map((instructor) => (
          <Card key={instructor.id}>
            <CardHeader>
              <CardTitle>{instructor.name}</CardTitle>
              <CardDescription>{instructor.email}</CardDescription>
            </CardHeader>
            <CardContent>
              {instructor.bio && (
                <p className="text-sm text-muted-foreground">{instructor.bio}</p>
              )}
            </CardContent>
          </Card>
        ))}
        {instructors.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No instructors yet. Add your first instructor!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

