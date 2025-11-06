"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb, type User, type Course } from "@/lib/mock-data";

export default function InstructorProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;
    
    const userProfile = await mockDb.getUserById(currentUser.id);
    const instructorCourses = await mockDb.getCourses({ instructorId: currentUser.id });
    
    setProfile(userProfile);
    setCourses(instructorCourses);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Your instructor profile information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{profile.email}</p>
            </div>
            {profile.bio && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bio</p>
                <p className="text-lg">{profile.bio}</p>
              </div>
            )}
            {profile.subjectSpecialization && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subject Specialization</p>
                <p className="text-lg">{profile.subjectSpecialization}</p>
              </div>
            )}
            {profile.pricePerSession && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price per Session</p>
                <p className="text-lg">${profile.pricePerSession}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courses You Teach</CardTitle>
            <CardDescription>All courses you're currently teaching</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <div className="space-y-2">
                {courses.map((course) => (
                  <div key={course.id} className="p-3 border rounded-lg">
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.enrolledStudents?.length || 0} students enrolled
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No courses yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

