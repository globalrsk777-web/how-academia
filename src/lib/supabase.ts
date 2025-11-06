// Supabase client setup for future integration
// Currently using mock data, but this file provides the structure for Supabase integration

import { createClient } from "@supabase/supabase-js";

// These environment variables should be set when integrating with Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create Supabase client
// Note: This is set up for future use. Currently, the app uses mock data.
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Auth helpers
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Using mock data.");
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Using mock data.");
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) {
    throw new Error("Supabase is not configured. Using mock data.");
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (!supabase) {
    return null;
  }
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Database helpers - these would replace mock data calls when integrated
export const supabaseDb = {
  // Users
  async getUsers(filters?: { role?: string; institutionId?: string }) {
    if (!supabase) return [];
    let query = supabase.from("users").select("*");
    if (filters?.role) query = query.eq("role", filters.role);
    if (filters?.institutionId) query = query.eq("institution_id", filters.institutionId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Courses
  async getCourses(filters?: { instructorId?: string; studentId?: string }) {
    if (!supabase) return [];
    let query = supabase.from("courses").select("*");
    if (filters?.instructorId) query = query.eq("instructor_id", filters.instructorId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Exams
  async getExams(filters?: { instructorId?: string; courseId?: string }) {
    if (!supabase) return [];
    let query = supabase.from("exams").select("*");
    if (filters?.instructorId) query = query.eq("instructor_id", filters.instructorId);
    if (filters?.courseId) query = query.eq("course_id", filters.courseId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Sessions
  async getSessions(filters?: { instructorId?: string; studentId?: string }) {
    if (!supabase) return [];
    let query = supabase.from("sessions").select("*");
    if (filters?.instructorId) query = query.eq("instructor_id", filters.instructorId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Institutions
  async getInstitutions() {
    if (!supabase) return [];
    const { data, error } = await supabase.from("institutions").select("*");
    if (error) throw error;
    return data || [];
  },

  // Messages
  async getMessages(sessionId: string) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  },
};

