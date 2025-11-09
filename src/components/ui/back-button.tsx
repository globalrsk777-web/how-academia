"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  fallbackHref?: string;
  label?: string;
}

export function BackButton({ className, fallbackHref = "/student/dashboard", label = "Back" }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    // Always try to go back in browser history first
    router.back();
  };

  // Don't show back button on dashboard pages
  if (pathname === "/student/dashboard" || pathname === "/instructor/dashboard" || pathname === "/institution/dashboard") {
    return null;
  }

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={cn(
        "mb-4 hover:bg-accent hover:text-accent-foreground transition-all duration-200",
        "hover:scale-105 active:scale-95",
        className
      )}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

