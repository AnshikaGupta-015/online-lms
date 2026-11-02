import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Role } from './types';

// Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';

// Pages
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { LessonPlayerPage } from './pages/LessonPlayerPage';
import { QuizPage } from './pages/QuizPage';
import { CertificatePage } from './pages/CertificatePage';
import { InstructorDashboardPage } from './pages/InstructorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportPage } from './pages/SupportPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3 // 3 minutes
    }
  }
});

// Scroll to top on page navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Guard with Role Verification
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Standard Layout Wrapper (with Navbar & Footer)
const StandardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              
              {/* Public Pages */}
              <Route path="/" element={<StandardLayout><HomePage /></StandardLayout>} />
              <Route path="/courses" element={<StandardLayout><CoursesPage /></StandardLayout>} />
              <Route path="/courses/:slug" element={<StandardLayout><CourseDetailPage /></StandardLayout>} />
              
              {/* Certificate Verification (Public) */}
              <Route path="/certificate/:certificateId" element={<StandardLayout><CertificatePage /></StandardLayout>} />
              <Route path="/verify" element={<StandardLayout><VerifyCertificatePage /></StandardLayout>} />
              <Route path="/verify/:code" element={<StandardLayout><VerifyCertificatePage /></StandardLayout>} />

              {/* Auth Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Student Portal */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                    <StandardLayout>
                      <StudentDashboardPage />
                    </StandardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Immersive Lesson Player (Dedicated full-screen workspace) */}
              <Route
                path="/learn/:courseSlug"
                element={
                  <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                    <LessonPlayerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn/:courseSlug/:lessonId"
                element={
                  <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                    <LessonPlayerPage />
                  </ProtectedRoute>
                }
              />

              {/* Quiz Exam */}
              <Route
                path="/learn/:courseSlug/quiz"
                element={
                  <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                    <StandardLayout>
                      <QuizPage />
                    </StandardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Instructor Studio */}
              <Route
                path="/instructor"
                element={
                  <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                    <StandardLayout>
                      <InstructorDashboardPage />
                    </StandardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Console */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StandardLayout>
                      <AdminDashboardPage />
                    </StandardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Profile & Settings */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                    <StandardLayout>
                      <ProfilePage />
                    </StandardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Help & Support (tickets) */}
              {['/support', '/support/:ticketId'].map((path) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                      <StandardLayout>
                        <SupportPage />
                      </StandardLayout>
                    </ProtectedRoute>
                  }
                />
              ))}

              {/* 404 Fallback */}
              <Route path="*" element={<StandardLayout><NotFoundPage /></StandardLayout>} />

            </Routes>
            <ChatBot />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
