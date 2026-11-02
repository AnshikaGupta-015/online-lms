import {
  Role,
  CourseLevel,
  CourseStatus,
  User as BaseUser,
  Profile,
  Category,
  Course,
  Section,
  Lesson,
  Enrollment,
  Review,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  UserRole,
  CertificateRecord,
  SupportTicket
} from '../src/types';

export interface User extends BaseUser {
  passwordHash: string;
}

export type {
  Role,
  CourseLevel,
  CourseStatus,
  Profile,
  Category,
  Course,
  Section,
  Lesson,
  Enrollment,
  Review,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  UserRole,
  CertificateRecord,
  SupportTicket
};

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface LessonNote {
  id: string;
  userId: string;
  lessonId: string;
  content: string;
  updatedAt: string;
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

export interface DatabaseState {
  users: User[];
  profiles: Profile[];
  userRoles: UserRole[];
  categories: Category[];
  courses: Course[];
  sections: Section[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  reviews: Review[];
  quizzes: Quiz[];
  quizQuestions: QuizQuestion[];
  quizAttempts: QuizAttempt[];
  notes: LessonNote[];
  chatSessions: ChatSession[];
  chatMessages: ChatMessage[];
  certificates: CertificateRecord[];
  supportTickets: SupportTicket[];
}
