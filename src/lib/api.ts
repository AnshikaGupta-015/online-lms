import {
  Course,
  Category,
  Profile,
  Role,
  EnrolledCourseItem,
  Review,
  QuizAttempt,
  CertificateData,
  ChatSession,
  ChatMessage,
  SupportTicket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  Order,
  LearningStreakData,
  StudentReportData,
  StudyNote,
  Assignment,
  AssignmentSubmission
} from '../types';

const TOKEN_KEY = 'learnhub_auth_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  const token = getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  signup: (payload: { email: string; password: string; fullName: string; role?: 'student' | 'instructor' }) =>
    fetchApi<{ user: { id: string; email: string }; profile: Profile; role: Role; token: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  login: (payload: { email: string; password: string }) =>
    fetchApi<{ user: { id: string; email: string }; profile: Profile; role: Role; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  logout: () =>
    fetchApi<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),

  getMe: () =>
    fetchApi<{ user: { id: string; email: string } | null; profile: Profile | null; role: Role | null }>('/api/auth/me'),

  resetPassword: (email: string) =>
    fetchApi<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    fetchApi<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  updateProfile: (payload: { fullName?: string; bio?: string; avatarUrl?: string }) =>
    fetchApi<{ profile: Profile }>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  // Stats & Categories
  getStats: () =>
    fetchApi<{ totalCourses: number; totalStudents: number; totalInstructors: number; averageRating: number }>('/api/stats'),

  getCategories: () =>
    fetchApi<Category[]>('/api/categories'),

  // Courses
  getCourses: (params?: { search?: string; category?: string; level?: string; price?: string; rating?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, v);
      });
    }
    return fetchApi<Course[]>(`/api/courses?${query.toString()}`);
  },

  getCourseDetail: (slug: string) =>
    fetchApi<{
      course: Course;
      instructor: Profile;
      category: Category;
      aggregates: any;
      curriculum: any[];
      reviews: Review[];
      enrollment: any;
      completedLessonIds: string[];
    }>(`/api/courses/${slug}`),

  enrollCourse: (courseId: string) =>
    fetchApi<{ success: boolean; enrollment: any; message?: string }>(`/api/courses/${courseId}/enroll`, {
      method: 'POST'
    }),

  // Student Dashboard
  getStudentDashboard: () =>
    fetchApi<{
      stats: { enrolledCount: number; completedCount: number; hoursLearned: number };
      inProgressCourses: EnrolledCourseItem[];
      completedCourses: EnrolledCourseItem[];
      allCourses: EnrolledCourseItem[];
    }>('/api/student/dashboard'),

  // Learning Player
  getLearnCourse: (courseSlug: string) =>
    fetchApi<{
      course: Course;
      curriculum: any[];
      isEnrolled: boolean;
      isInstructor: boolean;
      isAdmin: boolean;
      enrollment: any;
      completedLessons: Record<string, boolean>;
      notes: Record<string, string>;
      quiz: { id: string; title: string; passPercentage: number } | null;
      latestQuizAttempt: QuizAttempt | null;
    }>(`/api/learn/${courseSlug}`),

  updateLessonProgress: (payload: { lessonId: string; courseId: string; completed: boolean }) =>
    fetchApi<{
      success: boolean;
      completed: boolean;
      completedCount: number;
      totalCount: number;
      enrollment: any;
      newlyCompleted: boolean;
    }>('/api/learn/progress', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  saveLessonNote: (lessonId: string, content: string) =>
    fetchApi<{ success: boolean; note: any }>('/api/learn/notes', {
      method: 'POST',
      body: JSON.stringify({ lessonId, content })
    }),

  // Reviews
  addReview: (courseId: string, payload: { rating: number; comment: string }) =>
    fetchApi<{ success: boolean; review: Review }>(`/api/courses/${courseId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Quiz
  getQuiz: (courseSlug: string) =>
    fetchApi<{
      quiz: { id: string; courseId: string; title: string; passPercentage: number };
      courseTitle: string;
      courseSlug: string;
      questions: { id: string; question: string; options: string[] }[];
      attempts: QuizAttempt[];
    }>(`/api/learn/${courseSlug}/quiz`),

  submitQuizAttempt: (courseSlug: string, answers: Record<string, number>) =>
    fetchApi<{
      attempt: QuizAttempt;
      feedback: {
        questionId: string;
        question: string;
        selectedIndex: number;
        correctIndex: number;
        isCorrect: boolean;
        explanation: string;
      }[];
      certificateId: string | null;
    }>(`/api/learn/${courseSlug}/quiz/attempt`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    }),

  // Certificate
  getCertificate: (certificateId: string) =>
    fetchApi<CertificateData>(`/api/certificates/${certificateId}`),

  // Instructor
  getInstructorDashboard: () =>
    fetchApi<{
      stats: { totalCourses: number; totalStudents: number; avgRating: number; totalEarnings: number };
      courses: Course[];
    }>('/api/instructor/dashboard'),

  createCourse: (payload: any) =>
    fetchApi<{ success: boolean; course: Course }>('/api/instructor/courses', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateCourse: (id: string, payload: any) =>
    fetchApi<{ success: boolean; course: Course }>(`/api/instructor/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  deleteCourse: (id: string) =>
    fetchApi<{ success: boolean; message: string }>(`/api/instructor/courses/${id}`, {
      method: 'DELETE'
    }),

  getCourseStudents: (courseId: string) =>
    fetchApi<{ courseTitle: string; students: any[] }>(`/api/instructor/courses/${courseId}/students`),

  // Admin
  getAdminDashboard: () =>
    fetchApi<{
      stats: { totalUsers: number; totalCourses: number; totalEnrollments: number; totalRevenue: number };
      enrollmentTrends: { month: string; enrollments: number; revenue: number }[];
      coursesByCategory: { name: string; fullName: string; courses: number }[];
    }>('/api/admin/dashboard'),

  getAdminUsers: () =>
    fetchApi<any[]>('/api/admin/users'),

  updateUserRole: (userId: string, role: Role) =>
    fetchApi<{ success: boolean; message: string }>(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    }),

  deleteUser: (userId: string) =>
    fetchApi<{ success: boolean; message: string }>(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    }),

  getAdminCourses: () =>
    fetchApi<Course[]>('/api/admin/courses'),

  updateCourseStatus: (courseId: string, status: string) =>
    fetchApi<{ success: boolean; course: Course }>(`/api/admin/courses/${courseId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  createCategory: (payload: { name: string; icon?: string }) =>
    fetchApi<{ category: Category }>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  deleteCategory: (id: string) =>
    fetchApi<{ success: boolean }>(`/api/admin/categories/${id}`, {
      method: 'DELETE'
    }),

  confirmResetPassword: (payload: { token: string; newPassword: string }) =>
    fetchApi<{ success: boolean; message: string }>('/api/auth/reset-password-confirm', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  deleteReview: (courseId: string) =>
    fetchApi<{ success: boolean; message: string }>(`/api/courses/${courseId}/reviews`, {
      method: 'DELETE'
    }),

  // Certificate Verification & Admin
  verifyCertificate: (code: string) =>
    fetchApi<CertificateData & { valid: boolean; code: string; revoked?: boolean; revokedAt?: string; revokedReason?: string }>(`/api/verify/${encodeURIComponent(code)}`),

  getAdminCertificates: () =>
    fetchApi<{
      id: string;
      code: string;
      userId: string;
      courseId: string;
      studentName: string;
      studentEmail: string;
      courseTitle: string;
      issuedAt: string;
      revoked: boolean;
      revokedAt?: string;
      revokedReason?: string;
    }[]>('/api/admin/certificates'),

  revokeCertificate: (code: string, reason?: string) =>
    fetchApi<{ success: boolean; message: string; certificate: any }>(`/api/admin/certificates/${encodeURIComponent(code)}/revoke`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    }),

  restoreCertificate: (code: string) =>
    fetchApi<{ success: boolean; message: string; certificate: any }>(`/api/admin/certificates/${encodeURIComponent(code)}/restore`, {
      method: 'PUT'
    }),

  getInstructorCourseQuiz: (courseId: string) =>
    fetchApi<{
      quiz: any;
      questions: any[];
      stats: { totalAttempts: number; avgScore: number; passRate: number };
    }>(`/api/instructor/courses/${courseId}/quiz`),

  updateInstructorCourseQuiz: (
    courseId: string,
    payload: {
      title?: string;
      passPercentage?: number;
      timeLimitMinutes?: number;
      maxAttempts?: number;
      questions?: any[];
    }
  ) =>
    fetchApi<{ success: boolean; quiz: any; questions: any[] }>(
      `/api/instructor/courses/${courseId}/quiz`,
      {
        method: 'PUT',
        body: JSON.stringify(payload)
      }
    ),

  // Customer Support
  createSupportTicket: (payload: {
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    description: string;
    pageUrl?: string;
  }) =>
    fetchApi<SupportTicket>('/api/support/tickets', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMySupportTickets: () =>
    fetchApi<SupportTicket[]>('/api/support/tickets'),

  getSupportTicket: (id: string) =>
    fetchApi<SupportTicket>(`/api/support/tickets/${id}`),

  replyToSupportTicket: (id: string, content: string) =>
    fetchApi<SupportTicket>(`/api/support/tickets/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content })
    }),

  updateSupportTicketStatus: (id: string, status: TicketStatus) =>
    fetchApi<SupportTicket>(`/api/support/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  getAdminSupportTickets: () =>
    fetchApi<SupportTicket[]>('/api/admin/support/tickets'),

  resetDatabase: (confirmation = 'RESET') =>
    fetchApi<{ success: boolean; message: string }>('/api/admin/reset-database', {
      method: 'POST',
      body: JSON.stringify({ confirmation })
    }),

  // AI Chat
  getChatSessions: () =>
    fetchApi<ChatSession[]>('/api/chat/sessions'),

  createChatSession: (payload?: { title?: string; courseId?: string }) =>
    fetchApi<ChatSession>('/api/chat/sessions', {
      method: 'POST',
      body: JSON.stringify(payload || {})
    }),

  // Server returns { session, messages }; always hand back a plain array.
  getSessionMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    const res = await fetchApi<ChatMessage[] | { session: ChatSession; messages: ChatMessage[] }>(
      `/api/chat/sessions/${sessionId}/messages`
    );
    return Array.isArray(res) ? res : (res.messages ?? []);
  },

  renameChatSession: (sessionId: string, title: string) =>
    fetchApi<ChatSession>(`/api/chat/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify({ title })
    }),

  deleteChatSession: (sessionId: string) =>
    fetchApi<{ success: boolean }>(`/api/chat/sessions/${sessionId}`, {
      method: 'DELETE'
    }),

  // Payments (Task 1)
  createPaymentOrder: (courseId: string) =>
    fetchApi<Order>('/api/payments/orders', {
      method: 'POST',
      body: JSON.stringify({ courseId })
    }),

  payOrder: (orderId: string, upiId: string) =>
    fetchApi<{ success: boolean; order: Order; enrollment: any }>(`/api/payments/orders/${orderId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ upiId })
    }),

  getMyPayments: () =>
    fetchApi<Order[]>('/api/payments/my'),

  getOrderReceipt: (orderId: string) =>
    fetchApi<{ order: Order; course: Course; student: { id: string; name: string; email: string } }>(
      `/api/payments/receipt/${orderId}`
    ),

  getAdminPayments: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    return fetchApi<{
      orders: Order[];
      stats: {
        totalRevenuePaise: number;
        totalRevenueInr: number;
        totalOrders: number;
        paidCount: number;
        failedCount: number;
      };
    }>(`/api/admin/payments?${query.toString()}`);
  },

  // Learning Activity & Streak (Task 3)
  getStudentActivity: (range = 365, userId?: string) => {
    const query = new URLSearchParams({ range: String(range) });
    if (userId) query.append('userId', userId);
    return fetchApi<LearningStreakData>(`/api/student/activity?${query.toString()}`);
  },

  // Student Progress Report (Task 4)
  getStudentReport: () =>
    fetchApi<StudentReportData>('/api/student/report'),

  // Study Notes & Assignments (Task 5)
  getCourseStudyNotes: (courseId: string) =>
    fetchApi<{ courseTitle: string; studyNotes: StudyNote[]; personalNotes: any[] }>(
      `/api/courses/${courseId}/study-notes`
    ),

  getCourseAssignments: (courseId: string) =>
    fetchApi<{ courseTitle: string; assignments: Assignment[] }>(
      `/api/courses/${courseId}/assignments`
    ),

  getMyAssignments: () =>
    fetchApi<Assignment[]>('/api/student/assignments'),

  submitAssignment: (id: string, payload: { content?: string; linkUrl?: string; submissionType?: string }) =>
    fetchApi<{ success: boolean; submission: AssignmentSubmission }>(`/api/assignments/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getInstructorAssignmentSubmissions: (id: string) =>
    fetchApi<{ assignment: Assignment; submissions: AssignmentSubmission[] }>(
      `/api/instructor/assignments/${id}/submissions`
    ),

  gradeSubmission: (id: string, payload: { marks: number; feedback?: string }) =>
    fetchApi<{ success: boolean; submission: AssignmentSubmission }>(
      `/api/instructor/submissions/${id}/grade`,
      {
        method: 'PUT',
        body: JSON.stringify(payload)
      }
    ),

  createAssignment: (courseId: string, payload: any) =>
    fetchApi<Assignment>(`/api/instructor/courses/${courseId}/assignments`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateAssignment: (id: string, payload: any) =>
    fetchApi<Assignment>(`/api/instructor/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  deleteAssignment: (id: string) =>
    fetchApi<{ success: boolean; message: string }>(`/api/instructor/assignments/${id}`, {
      method: 'DELETE'
    })
};

export async function streamChatResponse(params: {
  sessionId?: string;
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  courseId?: string;
  lessonId?: string;
  onSessionCreated?: (sessionId: string) => void;
  onChunk: (chunk: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (err: Error) => void;
  signal?: AbortSignal;
}): Promise<void> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      sessionId: params.sessionId,
      // Server expects a full messages array; the last item is the new user message
      messages: [...(params.history || []), { role: 'user', content: params.message }],
      courseId: params.courseId,
      lessonId: params.lessonId
    }),
    signal: params.signal
  });

  if (!response.ok) {
    let errorMsg = `Server error ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {
      // fallback
    }
    const err = new Error(errorMsg);
    if (params.onError) params.onError(err);
    throw err;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('ReadableStream not supported');
  }

  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let accumulated = '';
  let finished = false;

  try {
    while (!finished) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.slice(5).trim();
        if (!dataStr || dataStr === '[DONE]') continue;

        let parsed: any;
        try {
          parsed = JSON.parse(dataStr);
        } catch {
          continue; // ignore non-JSON SSE lines
        }

        if (parsed.type === 'session' && parsed.sessionId) {
          params.onSessionCreated?.(parsed.sessionId);
        } else if (parsed.type === 'chunk' && parsed.text) {
          accumulated += parsed.text;
          params.onChunk(parsed.text);
        } else if (parsed.type === 'error') {
          finished = true;
          params.onError?.(new Error(parsed.error || 'AI error'));
          return;
        } else if (parsed.type === 'done') {
          finished = true;
          params.onComplete?.(accumulated);
          return;
        }
      }
    }
    if (!finished) {
      params.onComplete?.(accumulated);
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      // Aborted by user
      return;
    }
    params.onError?.(err);
    throw err;
  }
}