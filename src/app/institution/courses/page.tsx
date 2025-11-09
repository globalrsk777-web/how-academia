"use client";

import { useCollection } from "@/lib/firebase/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import type { Course } from "@/types";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InstitutionCoursesPage() {
  const { data: courses, loading } = useCollection<Course>("courses");

  // Mock courses for demonstration
  const mockCourses = [
    {
      id: "mock1",
      title: "Introduction to Modern Physics",
      instructorName: "Dr. Evelyn Reed",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
    },
    {
      id: "mock2",
      title: "World History: Ancient Civilizations",
      instructorName: "Dr. Eleanor Vance",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    },
    {
      id: "mock3",
      title: "Algebra II: Mastering Functions",
      instructorName: "Prof. Alan Turing",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
    },
    {
      id: "mock4",
      title: "Fundamentals of Digital Art",
      instructorName: "Isabella Chen",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    },
    {
      id: "mock5",
      title: "Machine Learning by Stanford University",
      instructorName: "Andrew Ng",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    },
    {
      id: "mock6",
      title: "The Science of Well-Being by Yale",
      instructorName: "Laurie Santos",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    },
    {
      id: "mock7",
      title: "CS50's Introduction to Computer Science",
      instructorName: "David J. Malan",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    },
    {
      id: "mock8",
      title: "Google UX Design Professional Certificate",
      instructorName: "Google Career Certificates",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    },
  ];

  const allCourses = courses && courses.length > 0 
    ? courses.map(course => ({
        ...course,
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
      }))
    : mockCourses;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading">Courses</h1>
        </div>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      {loading && courses ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allCourses.map((course, index) => (
            <Card 
              key={course.id} 
              className="overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                {!course.image && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/30" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription>by {course.instructorName || "Unknown Instructor"}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/institution/courses`}>
                  <Button className="w-full hover:scale-105 active:scale-95 transition-transform duration-200">
                    View Course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
