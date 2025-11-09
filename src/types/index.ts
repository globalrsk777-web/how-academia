export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName?: string;
  institutionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName?: string;
  instructorId: string;
  instructorName?: string;
  questions: ExamQuestion[];
  duration: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string;
  points: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName?: string;
  answers: Record<string, string>;
  score?: number;
  submittedAt?: string;
  createdAt: string;
}

export interface Schedule {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName?: string;
  startTime: string;
  endTime: string;
  courseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName?: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "live" | "ended";
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Institution {
  id: string;
  name: string;
  description: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  staffCount?: number;
  price?: number;
  priceType?: "monthly" | "yearly" | "free";
  createdAt: string;
  updatedAt: string;
}

