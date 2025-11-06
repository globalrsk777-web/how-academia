// Mock data layer to replace Supabase calls

export type UserRole = "student" | "instructor" | "institution";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  institutionId?: string;
  subjectSpecialization?: string; // For instructors
  pricePerSession?: number; // For instructors
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  institutionId: string;
  createdAt: string;
  enrolledStudents?: string[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  instructorId: string;
  instructorName: string;
  duration: number; // minutes
  questions: ExamQuestion[];
  createdAt: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, number>;
  score: number;
  totalPoints: number;
  submittedAt: string;
  status: "completed" | "in-progress";
}

export interface Session {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  courseId?: string;
  scheduledAt: string;
  duration: number; // minutes
  maxParticipants: number;
  participants: string[];
}

export interface Institution {
  id: string;
  name: string;
  description: string;
  logo?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

// Mock data storage
class MockDatabase {
  private users: User[] = [];
  private courses: Course[] = [];
  private exams: Exam[] = [];
  private examSubmissions: ExamSubmission[] = [];
  private sessions: Session[] = [];
  private institutions: Institution[] = [];
  private messages: Message[] = [];
  private currentUser: User | null = null;

  // Initialize with sample data
  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Institutions
    this.institutions = [
      {
        id: "inst1",
        name: "Tech University",
        description: "Leading technology education institution",
        createdAt: new Date().toISOString(),
      },
      {
        id: "inst2",
        name: "Business Academy",
        description: "Premier business and management school",
        createdAt: new Date().toISOString(),
      },
    ];

    // Users
    this.users = [
      {
        id: "instructor1",
        email: "instructor@example.com",
        name: "Dr. Sarah Johnson",
        role: "instructor",
        bio: "Expert in Computer Science with 10 years of experience",
        institutionId: "inst1",
        subjectSpecialization: "Computer Science",
        pricePerSession: 50,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor2",
        email: "instructor2@example.com",
        name: "Prof. Michael Chen",
        role: "instructor",
        bio: "Mathematics and Statistics specialist",
        institutionId: "inst1",
        subjectSpecialization: "Mathematics",
        pricePerSession: 45,
        createdAt: new Date().toISOString(),
      },
      {
        id: "student1",
        email: "student@example.com",
        name: "Alex Thompson",
        role: "student",
        institutionId: "inst1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "institution1",
        email: "admin@techuniversity.com",
        name: "Tech University Admin",
        role: "institution",
        institutionId: "inst1",
        createdAt: new Date().toISOString(),
      },
    ];

    // Courses
    this.courses = [
      {
        id: "course1",
        title: "Introduction to Web Development",
        description: "Learn HTML, CSS, and JavaScript fundamentals",
        instructorId: "instructor1",
        instructorName: "Dr. Sarah Johnson",
        institutionId: "inst1",
        enrolledStudents: ["student1"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "course2",
        title: "Advanced Data Structures",
        description: "Deep dive into algorithms and data structures",
        instructorId: "instructor1",
        instructorName: "Dr. Sarah Johnson",
        institutionId: "inst1",
        enrolledStudents: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: "course3",
        title: "Linear Algebra",
        description: "Mathematical foundations for machine learning",
        instructorId: "instructor2",
        instructorName: "Prof. Michael Chen",
        institutionId: "inst1",
        enrolledStudents: ["student1"],
        createdAt: new Date().toISOString(),
      },
    ];

    // Exams
    this.exams = [
      {
        id: "exam1",
        title: "Web Development Midterm",
        description: "Covers HTML, CSS basics",
        courseId: "course1",
        courseName: "Introduction to Web Development",
        instructorId: "instructor1",
        instructorName: "Dr. Sarah Johnson",
        duration: 60,
        questions: [
          {
            id: "q1",
            question: "What does HTML stand for?",
            options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
            correctAnswer: 0,
            points: 10,
          },
          {
            id: "q2",
            question: "Which CSS property is used to change text color?",
            options: ["font-color", "text-color", "color", "text-style"],
            correctAnswer: 2,
            points: 10,
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ];

    // Sessions
    this.sessions = [
      {
        id: "session1",
        title: "Live Coding Session: React Basics",
        description: "Interactive coding session on React fundamentals",
        instructorId: "instructor1",
        instructorName: "Dr. Sarah Johnson",
        courseId: "course1",
        scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        duration: 90,
        maxParticipants: 30,
        participants: ["student1"],
      },
    ];

    // Exam Submissions
    this.examSubmissions = [
      {
        id: "submission1",
        examId: "exam1",
        studentId: "student1",
        studentName: "Alex Thompson",
        answers: { q1: 0, q2: 2 },
        score: 20,
        totalPoints: 20,
        submittedAt: new Date().toISOString(),
        status: "completed",
      },
    ];
  }

  // Auth methods
  setCurrentUser(user: User | null) {
    this.currentUser = user;
    // Persist to localStorage for page reloads/navigation
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("currentUser");
      }
    }
  }

  getCurrentUser(): User | null {
    // First check in-memory
    if (this.currentUser) {
      return this.currentUser;
    }
    // Then check localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        try {
          const user = JSON.parse(stored) as User;
          this.currentUser = user;
          return user;
        } catch (e) {
          // Invalid data, remove it
          localStorage.removeItem("currentUser");
        }
      }
    }
    return null;
  }

  async signIn(email: string, password: string): Promise<User | null> {
    // Mock: find user or create new one
    let user = this.users.find((u) => u.email === email);
    if (!user) {
      // Auto-create user (will need role assignment)
      user = {
        id: `user_${Date.now()}`,
        email,
        name: email.split("@")[0],
        role: "student", // Default, will be updated by role selection
        createdAt: new Date().toISOString(),
      };
      this.users.push(user);
    }
    this.setCurrentUser(user);
    return user;
  }

  async signUp(email: string, password: string, role: UserRole, name?: string): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name: name || email.split("@")[0],
      role,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    this.setCurrentUser(user);
    return user;
  }

  async signOut(): Promise<void> {
    this.setCurrentUser(null);
  }

  // User methods
  async getUsers(filters?: { role?: UserRole; institutionId?: string }): Promise<User[]> {
    let result = [...this.users];
    if (filters?.role) {
      result = result.filter((u) => u.role === filters.role);
    }
    if (filters?.institutionId) {
      result = result.filter((u) => u.institutionId === filters.institutionId);
    }
    return result;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  // Course methods
  async getCourses(filters?: { instructorId?: string; studentId?: string }): Promise<Course[]> {
    let result = [...this.courses];
    if (filters?.instructorId) {
      result = result.filter((c) => c.instructorId === filters.instructorId);
    }
    if (filters?.studentId) {
      result = result.filter((c) => c.enrolledStudents?.includes(filters.studentId!));
    }
    return result;
  }

  async getCourseById(id: string): Promise<Course | null> {
    return this.courses.find((c) => c.id === id) || null;
  }

  async createCourse(course: Omit<Course, "id" | "createdAt">): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: `course_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  async enrollInCourse(courseId: string, studentId: string): Promise<void> {
    const course = this.courses.find((c) => c.id === courseId);
    if (course) {
      if (!course.enrolledStudents) {
        course.enrolledStudents = [];
      }
      if (!course.enrolledStudents.includes(studentId)) {
        course.enrolledStudents.push(studentId);
      }
    }
  }

  // Exam methods
  async getExams(filters?: { instructorId?: string; courseId?: string }): Promise<Exam[]> {
    let result = [...this.exams];
    if (filters?.instructorId) {
      result = result.filter((e) => e.instructorId === filters.instructorId);
    }
    if (filters?.courseId) {
      result = result.filter((e) => e.courseId === filters.courseId);
    }
    return result;
  }

  async getExamById(id: string): Promise<Exam | null> {
    return this.exams.find((e) => e.id === id) || null;
  }

  async createExam(exam: Omit<Exam, "id" | "createdAt">): Promise<Exam> {
    const newExam: Exam = {
      ...exam,
      id: `exam_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.exams.push(newExam);
    return newExam;
  }

  // Exam Submission methods
  async getExamSubmissions(filters?: { examId?: string; studentId?: string; instructorId?: string }): Promise<ExamSubmission[]> {
    let result = [...this.examSubmissions];
    if (filters?.examId) {
      result = result.filter((s) => s.examId === filters.examId);
    }
    if (filters?.studentId) {
      result = result.filter((s) => s.studentId === filters.studentId);
    }
    if (filters?.instructorId) {
      const instructorExams = this.exams.filter((e) => e.instructorId === filters.instructorId).map((e) => e.id);
      result = result.filter((s) => instructorExams.includes(s.examId));
    }
    return result;
  }

  async createExamSubmission(submission: Omit<ExamSubmission, "id" | "submittedAt">): Promise<ExamSubmission> {
    const newSubmission: ExamSubmission = {
      ...submission,
      id: `submission_${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    this.examSubmissions.push(newSubmission);
    return newSubmission;
  }

  // Session methods
  async getSessions(filters?: { instructorId?: string; studentId?: string }): Promise<Session[]> {
    let result = [...this.sessions];
    if (filters?.instructorId) {
      result = result.filter((s) => s.instructorId === filters.instructorId);
    }
    if (filters?.studentId) {
      result = result.filter((s) => s.participants.includes(filters.studentId!));
    }
    return result;
  }

  async getSessionById(id: string): Promise<Session | null> {
    return this.sessions.find((s) => s.id === id) || null;
  }

  async createSession(session: Omit<Session, "id">): Promise<Session> {
    const newSession: Session = {
      ...session,
      id: `session_${Date.now()}`,
    };
    this.sessions.push(newSession);
    return newSession;
  }

  // Institution methods
  async getInstitutions(): Promise<Institution[]> {
    return [...this.institutions];
  }

  async getInstitutionById(id: string): Promise<Institution | null> {
    return this.institutions.find((i) => i.id === id) || null;
  }

  // Message methods
  async getMessages(sessionId: string): Promise<Message[]> {
    return this.messages.filter((m) => m.sessionId === sessionId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async createMessage(message: Omit<Message, "id" | "createdAt">): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }
}

// Singleton instance
export const mockDb = new MockDatabase();

