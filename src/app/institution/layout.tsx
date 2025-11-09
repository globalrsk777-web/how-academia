"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar, SidebarItem } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/loading";
import { BackButton } from "@/components/ui/back-button";

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userProfile, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!userProfile || userProfile.role !== "institution")) {
      router.push("/login");
    }
  }, [userProfile, loading, router]);

  if (loading) {
    return <PageLoading />;
  }

  if (!userProfile || userProfile.role !== "institution") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar>
        <SidebarItem href="/institution/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
          Dashboard
        </SidebarItem>
        <SidebarItem href="/institution/instructors" icon={<Users className="h-4 w-4" />}>
          Instructors
        </SidebarItem>
        <SidebarItem href="/institution/students" icon={<UserPlus className="h-4 w-4" />}>
          Students
        </SidebarItem>
        <SidebarItem href="/institution/courses" icon={<BookOpen className="h-4 w-4" />}>
          Courses
        </SidebarItem>
        <SidebarItem href="/institutions" icon={<GraduationCap className="h-4 w-4" />}>
          Institutions
        </SidebarItem>
        <div className="mt-auto pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </Sidebar>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <BackButton fallbackHref="/institution/dashboard" />
          {children}
        </div>
      </main>
    </div>
  );
}

