"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, Building2, Loader2 } from "lucide-react";
import type { UserRole } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    if (!authLoading && userProfile) {
      if (userProfile.role === "student") {
        router.push("/student/dashboard");
      } else if (userProfile.role === "instructor") {
        router.push("/instructor/dashboard");
      } else if (userProfile.role === "institution") {
        router.push("/institution/dashboard");
      }
    }
  }, [userProfile, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password, selectedRole);
      // Redirect based on role
      if (selectedRole === "student") {
        router.push("/student/dashboard");
      } else if (selectedRole === "instructor") {
        router.push("/instructor/dashboard");
      } else if (selectedRole === "institution") {
        router.push("/institution/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-heading text-center">
            How Academia
          </CardTitle>
          <CardDescription className="text-center text-base">
            Karibu! Welcome to Uganda's premier learning platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nakato.mary@mak.ac.ug"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                disabled={loading}
                className="h-11 transition-all duration-200 focus:scale-[1.02]"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your secure password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                disabled={loading}
                className="h-11 transition-all duration-200 focus:scale-[1.02]"
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Continue as:</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant={selectedRole === "student" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedRole("student");
                    setError("");
                  }}
                  className="w-full justify-start h-11"
                  disabled={loading}
                >
                  <User className="mr-2 h-4 w-4" />
                  Continue as Student
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "instructor" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedRole("instructor");
                    setError("");
                  }}
                  className="w-full justify-start h-11"
                  disabled={loading}
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Continue as Instructor
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "institution" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedRole("institution");
                    setError("");
                  }}
                  className="w-full justify-start h-11"
                  disabled={loading}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Continue as Institution
                </Button>
              </div>
            </div>

            {error && (
              <div 
                className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold" 
              disabled={loading || !selectedRole}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In / Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

