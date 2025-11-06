"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb, type UserRole } from "@/lib/mock-data";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    try {
      // Try to sign in, which will auto-create if user doesn't exist
      const user = await mockDb.signIn(email, password);
      
      if (user) {
        // Update user role if it was changed
        if (user.role !== selectedRole) {
          await mockDb.updateUser(user.id, { role: selectedRole });
        }
        
        // Redirect to role-specific dashboard
        router.push(`/${selectedRole}`);
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
  };

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
    setError("");

    // If email is provided, try to sign in/sign up immediately
    if (email && password) {
      try {
        const user = await mockDb.signIn(email, password);
        if (user) {
          await mockDb.updateUser(user.id, { role });
          router.push(`/${role}`);
        }
      } catch (err) {
        // Continue with form submission
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-heading font-bold text-center">How Academia</CardTitle>
          <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="space-y-3 pt-4">
              <p className="text-sm font-medium text-center">Continue as:</p>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant={selectedRole === "student" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleRoleSelect("student")}
                >
                  Continue as Student
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "instructor" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleRoleSelect("instructor")}
                >
                  Continue as Instructor
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "institution" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleRoleSelect("institution")}
                >
                  Continue as Institution
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!selectedRole}>
              {selectedRole ? `Sign ${mockDb.getCurrentUser() ? "In" : "Up"}` : "Select Role First"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

