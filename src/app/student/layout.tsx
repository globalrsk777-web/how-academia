"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarLink } from "@/components/ui/sidebar";
import { mockDb } from "@/lib/mock-data";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  User,
  LogOut,
  Video,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(mockDb.getCurrentUser());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);
    
    if (!user || user.role !== "student") {
      router.push("/login");
    }
  }, [router]);

  const handleSignOut = async () => {
    await mockDb.signOut();
    setCurrentUser(null);
    router.push("/login");
  };

  if (!mounted || !currentUser || currentUser.role !== "student") {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        <SidebarLink href="/student" icon={<LayoutDashboard className="h-4 w-4" />}>
          Dashboard
        </SidebarLink>
        <SidebarLink href="/student/courses" icon={<BookOpen className="h-4 w-4" />}>
          My Courses
        </SidebarLink>
        <SidebarLink href="/student/exams" icon={<FileText className="h-4 w-4" />}>
          My Exams
        </SidebarLink>
        <SidebarLink href="/student/schedule" icon={<Calendar className="h-4 w-4" />}>
          My Schedule
        </SidebarLink>
        <SidebarLink href="/student/tutors" icon={<Users className="h-4 w-4" />}>
          Tutors
        </SidebarLink>
        <SidebarLink href="/live-sessions" icon={<Video className="h-4 w-4" />}>
          Live Sessions
        </SidebarLink>
        <SidebarLink href="/institutions" icon={<Building2 className="h-4 w-4" />}>
          Institutions
        </SidebarLink>
        <SidebarLink href="/student/profile" icon={<User className="h-4 w-4" />}>
          Profile
        </SidebarLink>
        <div className="mt-auto pt-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Sidebar>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

