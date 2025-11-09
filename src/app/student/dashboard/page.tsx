"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Clock, ArrowRight } from "lucide-react";
import type { Course, Schedule } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

export default function StudentDashboard() {
  const { userProfile } = useAuth();
  
  const { data: courses } = useCollection<Course>("courses");
  const { data: schedules } = useCollection<Schedule>("schedule");
  
  // Mock data for demonstration
  const enrolledCoursesCount = 4;
  const averageScore = 88.5;
  const scoreChange = 2.5;
  
  // Get upcoming session (today or next)
  const upcomingSession = schedules
    ?.filter(s => new Date(s.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
  
  // Get main courses (first 2)
  const mainCourses = courses?.slice(0, 2) || [];
  
  // Course images (placeholder URLs - in real app these would be actual images)
  const courseImages: Record<string, string> = {
    "course1": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
    "course2": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    "default": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">Student Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{enrolledCoursesCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Keep up the good work!</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +{scoreChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingSession ? (
              <>
                <div className="font-semibold text-lg">{upcomingSession.title}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(upcomingSession.startTime), "EEEE 'at' h:mm a")}
                </p>
              </>
            ) : (
              <>
                <div className="font-semibold text-lg">Physics Q&A</div>
                <p className="text-sm text-muted-foreground mt-1">Today at 10:00 AM</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Courses Section */}
      <div>
        <h2 className="text-2xl font-bold font-heading mb-4">My Courses</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mainCourses.length > 0 ? (
            mainCourses.map((course, index) => {
              const imageUrl = courseImages[course.id] || courseImages.default;
              return (
                <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description || "Explore the wonders of this course."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/student/courses`}>
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Go to Course
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <>
              {/* Mock course cards */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/10 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/30" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Introduction to Modern Physics</CardTitle>
                  <CardDescription>
                    Explore the wonders of quantum mechanics, relativity, and the cosmos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/student/courses`}>
                    <Button className="w-full">
                      Go to Course
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative h-48 bg-gradient-to-br from-amber-500/20 to-orange-500/10 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/30" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>World History: Ancient Civilizations</CardTitle>
                  <CardDescription>
                    Journey through the rise and fall of great empires of the past.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/student/courses`}>
                    <Button className="w-full">
                      Go to Course
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
