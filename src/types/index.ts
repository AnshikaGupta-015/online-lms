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

// ==========================================
// COURSE PRICING & PAYMENT HELPER (SINGLE SOURCE OF TRUTH)
// ==========================================

/**
 * Strict Payment Trigger Rule:
 * The ONLY condition for a paid course is Number(course.price) > 0.
 * Even a course priced at ₹1 must open the full UPI checkout.
 * Only price === 0 is free, and free courses keep one-click enroll with NO payment UI.
 */
export function isPaidCourse(course: { price?: number | null } | null | undefined): boolean {
  if (!course || course.price === undefined || course.price === null) return false;
  const num = Number(course.price);
  return !isNaN(num) && num > 0;
}

/**
 * Format currency amount into INR (₹).
 * Never rounds small non-zero amounts to free.
 */
export function formatInr(price: number | null | undefined): string {
  if (price === undefined || price === null) return '₹0';
  const num = Number(price);
  if (isNaN(num) || num === 0) return 'Free';
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Format integer paise into INR (₹).
 */
export function formatPaise(paise: number): string {
  const inr = paise / 100;
  return `₹${inr.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(inr) ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
}

// ==========================================
// DUMMY UPI ORDERS & PAYMENTS
// ==========================================

export type OrderStatus = 'created' | 'paid' | 'failed';

export interface Order {
  id: string;
  orderNumber: string; // e.g. LH-ORD-2026-1001
  userId: string;
  userEmail?: string;
  userName?: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  instructorName?: string;
  basePricePaise: number;
  gstPaise: number; // 18% GST
  totalAmountPaise: number;
  currency: 'INR';
  status: OrderStatus;
  upiId?: string;
  maskedUpiId?: string;
  transactionId?: string;
  paymentMethod: 'upi';
  createdAt: string;
  paidAt?: string | null;
  failureReason?: string | null;
}

// ==========================================
// LEARNING STREAK & HEATMAP
// ==========================================

export interface LearningActivityDay {
  date: string; // YYYY-MM-DD (IST boundary)
  lessonsCompleted: number;
  minutes: number;
  quizzesAttempted: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface LearningStreakData {
  days: LearningActivityDay[];
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  totalLessonsCompleted: number;
  totalMinutesLearned: number;
}

// ==========================================
// STUDY NOTES & ASSIGNMENTS
// ==========================================

export interface StudyNote {
  id: string;
  courseId: string;
  sectionId: string;
  sectionTitle: string;
  title: string;
  content: string; // Markdown
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type AssignmentType = 'written' | 'link' | 'both';
export type SubmissionStatus = 'not_started' | 'submitted' | 'graded' | 'late';

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle?: string;
  sectionId?: string;
  sectionTitle?: string;
  title: string;
  instructions: string; // Markdown
  dueDate: string; // ISO date
  maxMarks: number;
  type: AssignmentType;
  createdAt: string;
  updatedAt: string;
  submissionCount?: number;
  userSubmission?: AssignmentSubmission | null;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  courseId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  submissionType: AssignmentType;
  content?: string;
  linkUrl?: string;
  status: SubmissionStatus;
  submittedAt: string;
  gradedAt?: string | null;
  marks?: number | null;
  feedback?: string | null;
  gradedBy?: string | null;
}

// ==========================================
// PROGRESS REPORT
// ==========================================

export interface CourseProgressDetail {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  thumbnailUrl: string;
  categoryName: string;
  progressPercent: number;
  totalLessons: number;
  completedLessons: number;
  totalDurationMinutes: number;
  learnedDurationMinutes: number;
  lastActivityAt?: string | null;
  bestQuizScore?: number | null;
  certificateCode?: string | null;
  status: 'completed' | 'in_progress' | 'not_started';
}

export interface StudentReportData {
  summary: {
    enrolledCount: number;
    completedCount: number;
    inProgressCount: number;
    certificatesCount: number;
    averageQuizScore: number;
    totalHoursLearned: number;
    totalLessonsCompleted: number;
  };
  courseStatusBreakdown: { name: string; value: number; color: string }[];
  categoryTimeBreakdown: { name: string; lessons: number; minutes: number; color: string }[];
  courseProgressList: CourseProgressDetail[];
  weeklyLessonActivity: { week: string; lessonsCompleted: number; minutesLearned: number }[];
  quizScoresOverTime: { date: string; quizTitle: string; score: number; passPercentage: number; passed: boolean }[];
  streak: LearningStreakData;
}
