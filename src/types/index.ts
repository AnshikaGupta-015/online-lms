export type Role = 'student' | 'instructor' | 'admin';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'pending' | 'published' | 'rejected';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  courseCount?: number;
}

export interface CourseAggregates {
  ratingAverage: number;
  totalReviews: number;
  enrollmentCount: number;
  totalLessons: number;
  totalDurationMinutes: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string;
  categoryId: string;
  level: CourseLevel;
  price: number;
  language: string;
  whatYouWillLearn: string[];
  requirements: string[];
  status: CourseStatus;
  instructorId: string;
  createdAt: string;
  aggregates?: CourseAggregates;
  instructor?: Profile;
  category?: Category;
  certificatesIssued?: number;
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  videoUrl: string;
  videoType: 'youtube' | 'upload';
  durationMinutes: number;
  position: number;
  isFreePreview: boolean;
  resourcesUrl?: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  position: number;
  lessons?: Lesson[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string | null;
  certificateId?: string | null;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: Profile;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  passPercentage: number;
  timeLimitMinutes?: number;
  maxAttempts?: number;
}

export interface QuizQuestion {
  id: string;
  quizId?: string;
  question: string;
  options: string[];
  correctIndex?: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  passed: boolean;
  answers: Record<string, number>;
  createdAt: string;
}

export interface EnrolledCourseItem {
  enrollment: Enrollment;
  course: Course;
  instructor?: Profile;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  nextLessonId?: string | null;
}

export interface CertificateRecord {
  id: string;
  code: string; // LH-YYYY-XXXXXXXXXX
  userId: string;
  courseId: string;
  issuedAt: string;
  revoked?: boolean;
  revokedAt?: string;
  revokedReason?: string;
}

export interface CertificateData {
  certificateId: string;
  code?: string;
  ownerId?: string;
  issuedAt: string;
  studentName: string;
  courseTitle: string;
  courseSlug: string;
  instructorName: string;
  totalDurationMinutes: number;
  totalLessons: number;
  revoked?: boolean;
  revokedAt?: string;
  revokedReason?: string;
}

export interface UserRole {
  userId: string;
  role: Role;
}

export interface ChatSession {
  id: string;
  userId: string;
  courseId: string | null;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

// ---------- Customer Support ----------
export type TicketCategory = 'bug' | 'payment' | 'course' | 'certificate' | 'account' | 'feedback' | 'other';
export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  content: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // LH-T-1001
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  pageUrl?: string; // in-app page where the problem happened
  messages: TicketMessage[]; // messages[0] is the original complaint
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
}
