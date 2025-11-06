"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockDb } from "@/lib/mock-data";

export default function Home() {
  const router = useRouter();
  const currentUser = mockDb.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      router.push(`/${currentUser.role}`);
    } else {
      router.push("/login");
    }
  }, [currentUser, router]);

  return null;
}

