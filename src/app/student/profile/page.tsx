"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Course } from "@/types";
import { User, Mail, BookOpen } from "lucide-react";

export default function StudentProfilePage() {
  const { userProfile } = useAuth();
  
  // In a real app, you'd have an enrollments collection
  const { data: courses } = useCollection<Course>("courses");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">Profile</h1>
        <p className="text-muted-foreground">Your student profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{userProfile?.name || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{userProfile?.email || "N/A"}</p>
            </div>
          </div>
          {userProfile?.bio && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Bio</p>
              <p>{userProfile.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <CardTitle>Enrolled Courses</CardTitle>
          </div>
          <CardDescription>Courses you are currently enrolled in</CardDescription>
        </CardHeader>
        <CardContent>
          {courses && courses.length > 0 ? (
            <div className="space-y-2">
              {courses.slice(0, 5).map((course) => (
                <div key={course.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{course.title}</p>
                  {course.description && (
                    <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No courses enrolled yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

