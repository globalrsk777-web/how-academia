"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import type { UserProfile } from "@/lib/store/authStore";
import { Users, User, Mail, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function StudentTutorsPage() {
  const [instructors, setInstructors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const allInstructors = await authStore.getUsersByRole("instructor");
        setInstructors(allInstructors);
      } catch (error) {
        console.error("Error loading instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInstructors();
  }, []);

  const handleContactTutor = (instructorName: string, instructorEmail: string) => {
    toast({
      title: "Contact Tutor",
      description: `You can reach ${instructorName} at ${instructorEmail}`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Tutors</h1>
        <p className="text-muted-foreground">Browse experienced instructors from Ugandan universities</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : instructors && instructors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor, index) => (
            <Card 
              key={instructor.id}
              className="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{instructor.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {instructor.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instructor.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{instructor.bio}</p>
                  )}
                  <div className="space-y-2">
                    {instructor.subject && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                        <span className="text-sm font-medium">Subject:</span>
                        <span className="text-sm text-muted-foreground">{instructor.subject}</span>
                      </div>
                    )}
                    {instructor.pricePerSession ? (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                        <span className="text-sm font-medium">Price:</span>
                        <span className="text-sm font-semibold text-primary">
                          UGX {instructor.pricePerSession.toLocaleString()}/session
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                        <span className="text-sm font-medium">Price:</span>
                        <span className="text-sm text-muted-foreground">Contact for pricing</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full hover:scale-105 active:scale-95 transition-transform duration-200"
                    onClick={() => handleContactTutor(instructor.name, instructor.email)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Tutor
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No tutors available at the moment</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new instructors</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

