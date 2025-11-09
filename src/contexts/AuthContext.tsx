"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authStore, type User, type UserProfile } from "@/lib/store/authStore";

export type UserRole = "student" | "instructor" | "institution";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set initial state
    setUser(authStore.getCurrentUser());
    setUserProfile(authStore.getCurrentUserProfile());
    setLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = authStore.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = authStore.getCurrentUserProfile();
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      let firebaseUser: User;

      // Try to sign in first
      try {
        firebaseUser = await authStore.signInWithEmailAndPassword(email, password);
        
        // Update role if needed
        const profile = authStore.getCurrentUserProfile();
        if (profile && profile.role !== role) {
          await authStore.updateUserProfile(profile.id, { role });
        }
      } catch (error: any) {
        // If user doesn't exist, create account
        if (error.message === "User not found") {
          firebaseUser = await authStore.createUserWithEmailAndPassword(email, password, role);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authStore.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      await authStore.updateUserProfile(user.uid, data);
      const updatedProfile = authStore.getCurrentUserProfile();
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, login, logout, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
