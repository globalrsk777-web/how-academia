// TypeScript-based authentication store
import type { UserRole } from "@/contexts/AuthContext";

export interface User {
  uid: string;
  email: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  bio?: string;
  avatar?: string;
  institutionId?: string;
  [key: string]: any;
}

class AuthStore {
  private currentUser: User | null = null;
  private currentUserProfile: UserProfile | null = null;
  private listeners: Set<(user: User | null) => void> = new Set();
  private users: Map<string, { password: string; profile: UserProfile }> = new Map();

  constructor() {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          this.currentUser = userData.user;
          this.currentUserProfile = userData.profile;
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }

  // Subscribe to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.add(callback);
    
    // Call immediately with current user
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach((callback) => callback(this.currentUser));
  }

  // Sign up
  async createUserWithEmailAndPassword(email: string, password: string, role: UserRole): Promise<User> {
    // Check if user already exists
    if (this.users.has(email)) {
      throw new Error("User already exists");
    }

    const uid = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const user: User = { uid, email };

    const profile: UserProfile = {
      id: uid,
      email,
      name: email.split("@")[0],
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(email, { password, profile });
    this.currentUser = user;
    this.currentUserProfile = profile;

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify({ user, profile }));
    }

    // Sync with dataStore
    if (typeof window !== "undefined") {
      try {
        const { dataStore } = await import("./dataStore");
        await dataStore.addDocument("users", profile);
      } catch (error) {
        console.error("Error syncing user to dataStore:", error);
      }
    }

    this.notifyListeners();
    return user;
  }

  // Sign in
  async signInWithEmailAndPassword(email: string, password: string): Promise<User> {
    const userData = this.users.get(email);
    
    if (!userData) {
      throw new Error("User not found");
    }

    if (userData.password !== password) {
      throw new Error("Invalid password");
    }

    this.currentUser = { uid: userData.profile.id, email };
    this.currentUserProfile = userData.profile;

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify({ 
        user: this.currentUser, 
        profile: this.currentUserProfile 
      }));
    }

    this.notifyListeners();
    return this.currentUser;
  }

  // Sign out
  async signOut(): Promise<void> {
    this.currentUser = null;
    this.currentUserProfile = null;

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user");
    }

    this.notifyListeners();
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get current user profile
  getCurrentUserProfile(): UserProfile | null {
    return this.currentUserProfile;
  }

  // Update user profile
  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    // Find user by email (since we store by email)
    for (const [email, userData] of this.users.entries()) {
      if (userData.profile.id === uid) {
        userData.profile = {
          ...userData.profile,
          ...data,
          updatedAt: new Date().toISOString(),
        };

        // Update current profile if it's the current user
        if (this.currentUser?.uid === uid) {
          this.currentUserProfile = userData.profile;
          
          // Update localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("auth_user", JSON.stringify({ 
              user: this.currentUser, 
              profile: this.currentUserProfile 
            }));
          }
        }

        // Sync with dataStore
        if (typeof window !== "undefined") {
          try {
            const { dataStore } = await import("./dataStore");
            await dataStore.updateDocument("users", uid, userData.profile);
          } catch (error) {
            console.error("Error syncing user to dataStore:", error);
          }
        }

        break;
      }
    }
  }

  // Get user profile (for other users)
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    for (const userData of this.users.values()) {
      if (userData.profile.id === uid) {
        return userData.profile;
      }
    }
    return null;
  }

  // Get all users by role
  async getUsersByRole(role: UserRole): Promise<UserProfile[]> {
    const profiles: UserProfile[] = [];
    for (const userData of this.users.values()) {
      if (userData.profile.role === role) {
        profiles.push(userData.profile);
      }
    }
    return profiles;
  }
}

// Singleton instance
export const authStore = new AuthStore();

