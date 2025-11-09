"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar, SidebarItem } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  User,
  Users,
  GraduationCap,
  Video,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/loading";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userProfile, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!userProfile || userProfile.role !== "student")) {
      router.push("/login");
    }
  }, [userProfile, loading, router]);

  if (loading) {
    return <PageLoading />;
  }

  if (!userProfile || userProfile.role !== "student") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar>
        <SidebarItem href="/student/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
          Dashboard
        </SidebarItem>
        <SidebarItem href="/student/courses" icon={<BookOpen className="h-4 w-4" />}>
          My Courses
        </SidebarItem>
        <SidebarItem href="/student/exams" icon={<FileText className="h-4 w-4" />}>
          My Exams
        </SidebarItem>
        <SidebarItem href="/student/schedule" icon={<Calendar className="h-4 w-4" />}>
          My Schedule
        </SidebarItem>
        <SidebarItem href="/student/tutors" icon={<Users className="h-4 w-4" />}>
          Tutors
        </SidebarItem>
        <SidebarItem href="/student/profile" icon={<User className="h-4 w-4" />}>
          Profile
        </SidebarItem>
        <SidebarItem href="/live-sessions" icon={<Video className="h-4 w-4" />}>
          Live Sessions
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
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

