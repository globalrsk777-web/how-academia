"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, Building2, Loader2, Eye, EyeOff } from "lucide-react";
import type { UserRole } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        {/* Gradient overlay for better visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/60 to-background/90" />
      </div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md shadow-2xl border-0 bg-background/95 backdrop-blur-md animate-fade-in">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-4 border-primary/30 shadow-lg">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-4xl font-heading text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            How Academia
          </CardTitle>
          <CardDescription className="text-center text-base mt-2">
            Karibu! Welcome to Uganda's premier learning platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
                className="h-12 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/50 bg-background/50 border-muted"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  disabled={loading}
                  className="h-12 pr-10 transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/50 bg-background/50 border-muted"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Continue as:</Label>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant={selectedRole === "student" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedRole("student");
                    setError("");
                  }}
                  className={`w-full justify-start h-12 transition-all duration-200 ${
                    selectedRole === "student" 
                      ? "shadow-lg shadow-primary/20 scale-[1.02]" 
                      : "hover:scale-[1.01] hover:border-primary/50"
                  }`}
                  disabled={loading}
                >
                  <User className="mr-3 h-5 w-5" />
                  <span className="font-medium">Continue as Student</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "instructor" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedRole("instructor");
                    setError("");
                  }}
                  className={`w-full justify-start h-12 transition-all duration-200 ${
                    selectedRole === "instructor" 
                      ? "shadow-lg shadow-primary/20 scale-[1.02]" 
                      : "hover:scale-[1.01] hover:border-primary/50"
                  }`}
                  disabled={loading}
                >
                  <GraduationCap className="mr-3 h-5 w-5" />
                  <span className="font-medium">Continue as Instructor</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "institution" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedRole("institution");
                    setError("");
                  }}
                  className={`w-full justify-start h-12 transition-all duration-200 ${
                    selectedRole === "institution" 
                      ? "shadow-lg shadow-primary/20 scale-[1.02]" 
                      : "hover:scale-[1.01] hover:border-primary/50"
                  }`}
                  disabled={loading}
                >
                  <Building2 className="mr-3 h-5 w-5" />
                  <span className="font-medium">Continue as Institution</span>
                </Button>
              </div>
            </div>

            {error && (
              <div 
                className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 animate-slide-in"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
              disabled={loading || !selectedRole}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In / Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse-slow z-0" style={{ animationDelay: '1s' }} />
    </div>
  );
}
