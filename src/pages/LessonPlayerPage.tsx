import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { ProgressBar } from '../components/ProgressBar';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
  Bookmark,
  Share2,
  Award,
  Lock,
  ArrowLeft,
  Check,
  Save,
  HelpCircle,
  FolderDown,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ChatBot } from '../components/ChatBot';

export const LessonPlayerPage: React.FC = () => {
  const { courseSlug, lessonId: paramLessonId } = useParams<{ courseSlug: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeLessonId, setActiveLessonId] = useState<string | null>(paramLessonId || null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'resources' | 'ask-ai'>('overview');
  const [currentNote, setCurrentNote] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch learning course data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['learnCourse', courseSlug],
    queryFn: () => api.getLearnCourse(courseSlug!),
    enabled: !!courseSlug
  });

  // Extract all lessons list flat
  const allLessons = React.useMemo(() => {
    if (!data?.curriculum) return [];
    return data.curriculum.flatMap((s) => s.lessons || []);
  }, [data?.curriculum]);

  // Set default active lesson if none specified in URL
  useEffect(() => {
    if (allLessons.length > 0 && !activeLessonId) {
      if (paramLessonId) {
        setActiveLessonId(paramLessonId);
      } else {
        // find first incomplete lesson or first lesson
        const firstIncomplete = allLessons.find((l) => !data?.completedLessons?.[l.id]);
        setActiveLessonId(firstIncomplete ? firstIncomplete.id : allLessons[0].id);
      }
    }
  }, [allLessons, paramLessonId, activeLessonId, data?.completedLessons]);

  // Sync current note when active lesson changes
  useEffect(() => {
    if (activeLessonId && data?.notes) {
      setCurrentNote(data.notes[activeLessonId] || '');
      setNoteSaved(false);
    }
  }, [activeLessonId, data?.notes]);

  // Find active lesson object
  const currentLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Completed count and progress
  const completedCount = allLessons.filter((l) => data?.completedLessons?.[l.id]).length;
  const totalCount = allLessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCurrentCompleted = activeLessonId ? !!data?.completedLessons?.[activeLessonId] : false;

  // Toggle Progress Mutation
  const progressMutation = useMutation({
    mutationFn: (payload: { lessonId: string; completed: boolean }) =>
      api.updateLessonProgress({
        lessonId: payload.lessonId,
        courseId: data!.course.id,
        completed: payload.completed
      }),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['learnCourse', courseSlug] });
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });

      if (res.newlyCompleted) {
        setShowCelebration(true);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Auto advance to next lesson if user just marked complete
      if (vars.completed && nextLesson) {
        setActiveLessonId(nextLesson.id);
      }
    }
  });

  // Save Note Mutation
  const saveNoteMutation = useMutation({
    mutationFn: () => api.saveLessonNote(activeLessonId!, currentNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learnCourse', courseSlug] });
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    }
  });

  const handleMarkComplete = () => {
    if (!activeLessonId || !data?.course) return;
    progressMutation.mutate({
      lessonId: activeLessonId,
      completed: !isCurrentCompleted
    });
  };

  const [hasEmbedError, setHasEmbedError] = useState(false);

  // Reset embed error on lesson change
  useEffect(() => {
    setHasEmbedError(false);
  }, [activeLessonId]);

  // Convert YouTube standard URL to embed iframe URL and extract direct link
  const getEmbedInfo = (url: string) => {
    if (!url) {
      return {
        embedUrl: 'https://www.youtube.com/embed/SqcY0GlETPk?autoplay=1&modestbranding=1&rel=0',
        directUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
        videoId: 'SqcY0GlETPk'
      };
    }
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    const videoId = match ? match[1] : null;
    if (videoId) {
      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1`,
        directUrl: `https://www.youtube.com/watch?v=${videoId}`,
        videoId
      };
    }
    return {
      embedUrl: url,
      directUrl: url,
      videoId: null
    };
  };

  const currentEmbedInfo = getEmbedInfo(currentLesson?.videoUrl || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading masterclass environment...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.course) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-lg font-bold">Course Access Restricted</h2>
          <p className="text-xs text-slate-400">
            You must be enrolled in this course to access the interactive lesson player.
          </p>
          <Link
            to={`/courses/${courseSlug}`}
            className="inline-block px-4 py-2 bg-indigo-600 rounded-lg text-xs font-semibold"
          >
            Go to Course Enrollment
          </Link>
        </div>
      </div>
    );
  }

  // Access control: Only enrolled users, instructors, or admins can view private lessons
  if (!data.isEnrolled && !data.isInstructor && !data.isAdmin && !currentLesson?.isFreePreview) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold">Enrollment Required</h2>
          <p className="text-xs text-slate-400">
            This module is reserved for registered students. Please enroll to access the remaining 10+ lessons, assignments, and quizzes.
          </p>
          <Link
            to={`/courses/${courseSlug}`}
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl"
          >
            Enroll in Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* TOP COMPACT PLAYER HEADER */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-30">
        <div className="flex items-center gap-3 truncate">
          <Link
            to={`/courses/${courseSlug}`}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            title="Back to Course Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate">
              {data.course.title}
            </h1>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {currentLesson?.title || 'Lesson Player'}
            </p>
          </div>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="w-36">
              <ProgressBar progress={progressPercent} showLabel={false} size="sm" color="emerald" />
            </div>
            <span className="font-mono text-[11px] text-slate-300 tabular-nums">
              {completedCount}/{totalCount} Completed
            </span>
          </div>

          {/* Quiz Button if quiz exists */}
          {data.quiz && (
            <Link
              to={`/learn/${courseSlug}/quiz`}
              className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Final Exam</span>
            </Link>
          )}

          {/* Certificate Badge if issued */}
          {data.enrollment?.certificateId && (
            <Link
              to={`/certificate/${data.enrollment.certificateId}`}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Certificate</span>
            </Link>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle curriculum sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* PLAYER WORKSPACE GRID */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT / CENTER: VIDEO PLAYER & TABS */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* VIDEO STAGE */}
          <div className="w-full bg-black aspect-video max-h-[68vh] flex items-center justify-center relative overflow-hidden group">
            {hasEmbedError ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900 border border-slate-800 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-900/20">
                  <PlayCircle className="w-8 h-8" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-base font-bold text-white">Embedded Playback Restricted</h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    This video creator restricts embedded iframe playback, or your browser is blocking third-party media cookies. You can watch this official masterclass lesson directly on YouTube.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={currentEmbedInfo.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open on YouTube (New Tab)</span>
                  </a>
                  <button
                    onClick={() => setHasEmbedError(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Retry Embedded Player
                  </button>
                </div>
              </div>
            ) : currentLesson?.videoUrl ? (
              <>
                <iframe
                  src={currentEmbedInfo.embedUrl}
                  title={currentLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  onClick={() => setHasEmbedError(true)}
                  className="absolute bottom-3 right-3 px-2.5 py-1 text-[11px] font-medium bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5"
                  title="If the video shows a playback error, click to open fallback"
                >
                  <HelpCircle className="w-3 h-3 text-amber-400" />
                  <span>Playback issue?</span>
                </button>
              </>
            ) : (
              <div className="text-slate-500 text-xs">Video content loading...</div>
            )}
          </div>

          {/* LESSON CONTROL STRIP */}
          <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {currentLesson?.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Duration: {currentLesson?.durationMinutes} min</span>
                {currentLesson?.isFreePreview && (
                  <span className="text-indigo-400 font-semibold">Free Preview Module</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
                className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleMarkComplete}
                disabled={progressMutation.isPending}
                className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  isCurrentCompleted
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isCurrentCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
              </button>

              <button
                disabled={!nextLesson}
                onClick={() => nextLesson && setActiveLessonId(nextLesson.id)}
                className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* YouTube Fallback Button */}
              {currentLesson?.videoUrl && (
                <a
                  href={currentLesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700/50"
                  title="Open video on YouTube"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Open on YouTube</span>
                </a>
              )}
            </div>
          </div>

          {/* TABS BELOW VIDEO */}
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Tab buttons */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview & Objectives
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'notes'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Personal Notes
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'resources'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Exercise Resources
              </button>
              <button
                onClick={() => setActiveTab('ask-ai')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'ask-ai'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                    : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 border border-indigo-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ask LearnHub AI</span>
              </button>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4 max-w-3xl text-xs text-slate-300 leading-relaxed">
                <h3 className="text-sm font-bold text-white">About this Lesson</h3>
                <p>
                  In this session, you explore the core architectural primitives necessary for production systems. Pay close attention to error boundaries, asynchronous recovery flows, and security policies.
                </p>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-white mb-2">Key Learning Objectives</h4>
                  <ul className="space-y-1.5 text-slate-400">
                    <li>• Understand strict typing boundary contracts across microservices</li>
                    <li>• Implement idempotent write APIs and avoid race conditions</li>
                    <li>• Verify compliance with Row-Level Security and audit logs</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB: NOTES (Saved per lesson to DB) */}
            {activeTab === 'notes' && (
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Lesson Notebook
                  </h3>
                  {noteSaved && (
                    <span className="text-xs text-emerald-400 font-semibold">
                      Saved to database ✓
                    </span>
                  )}
                </div>
                <textarea
                  rows={6}
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Record key architectural insights, code snippets, or ideas for this specific lesson..."
                  className="w-full p-4 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => saveNoteMutation.mutate()}
                    disabled={saveNoteMutation.isPending}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saveNoteMutation.isPending ? 'Saving...' : 'Save Note'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: RESOURCES */}
            {activeTab === 'resources' && (
              <div className="space-y-4 max-w-3xl text-xs">
                <h3 className="text-sm font-bold text-white">Downloads & Links</h3>
                <div className="space-y-2">
                  <a
                    href="https://github.com/learnhub-platform/course-starter-kit"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center justify-between text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span className="font-semibold">GitHub Course Repository Starter Kit</span>
                    <FolderDown className="w-4 h-4 text-slate-400" />
                  </a>
                  <a
                    href="https://learnhub.com/docs/architecture-checklist.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center justify-between text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span className="font-semibold">Architectural Evaluation Checklist (PDF)</span>
                    <FileText className="w-4 h-4 text-slate-400" />
                  </a>
                </div>
              </div>
            )}

            {/* TAB: ASK AI (Embedded Context-Aware Tutor) */}
            {activeTab === 'ask-ai' && (
              <div className="max-w-4xl">
                <ChatBot
                  embedded
                  courseId={data.course.id}
                  lessonId={currentLesson?.id}
                  lessonTitle={currentLesson?.title}
                />
              </div>
            )}

          </div>

        </div>

        {/* RIGHT / SIDEBAR: CURRICULUM ACCORDION & LESSON CHECKMARKS */}
        <div
          className={`${
            sidebarOpen ? 'w-full lg:w-80' : 'hidden'
          } bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto max-h-[85vh] lg:max-h-none`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Course Content
            </h3>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              {progressPercent}% completed
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {data.curriculum?.map((section, sIdx) => (
              <div key={section.id} className="py-2">
                <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </div>

                <div className="space-y-0.5">
                  {section.lessons?.map((lesson: any) => {
                    const isActive = lesson.id === activeLessonId;
                    const isDone = !!data.completedLessons?.[lesson.id];

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`w-full px-4 py-2.5 flex items-start gap-3 text-left transition-colors ${
                          isActive
                            ? 'bg-indigo-950/80 text-white font-semibold border-l-2 border-indigo-500'
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-xs truncate">{lesson.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                            {lesson.durationMinutes} min
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Certificate & Quiz Action Section in Sidebar (A.7) */}
          <div className="p-4 mt-auto border-t border-slate-800 bg-slate-950/40 space-y-3">
            {data.enrollment?.certificateId ? (
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    <Check className="w-3 h-3" /> Certificate Earned
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">Official Credential Issued</h4>
                  <p className="text-[10px] text-slate-400">Credential code: {data.enrollment.certificateId}</p>
                </div>
                <Link
                  to={`/certificate/${data.enrollment.certificateId}`}
                  className="block w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  View Certificate
                </Link>
              </div>
            ) : totalCount - completedCount > 0 ? (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Certificate Locked</h4>
                  <p className="text-[11px] text-amber-400 font-medium mt-0.5">
                    Complete {totalCount - completedCount} more lesson{totalCount - completedCount === 1 ? '' : 's'}
                    {data.quiz ? ' & pass final quiz' : ''} to unlock
                  </p>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Almost Certified!</h4>
                  <p className="text-[11px] text-amber-300 font-medium mt-0.5">
                    Pass the final quiz to unlock your certificate
                  </p>
                </div>
                {data.quiz && (
                  <Link
                    to={`/learn/${courseSlug}/quiz`}
                    className="block w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Take Quiz
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 100% COMPLETION CELEBRATION MODAL (A.5) */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {data.enrollment?.certificateId ? 'Certificate Earned!' : 'All Lessons Completed!'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have completed 100% of the lessons in <span className="font-semibold text-white">{data.course.title}</span>!
            </p>
            {data.enrollment?.certificateId ? (
              <div className="pt-2">
                <Link
                  to={`/certificate/${data.enrollment.certificateId}`}
                  className="inline-block px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  View Your Official Certificate
                </Link>
              </div>
            ) : (
              <div className="pt-2 space-y-2">
                <p className="text-xs text-amber-400 font-medium">
                  Pass the final quiz to unlock your certificate
                </p>
                <Link
                  to={`/learn/${courseSlug}/quiz`}
                  className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Take Quiz
                </Link>
              </div>
            )}
            <button
              onClick={() => setShowCelebration(false)}
              className="text-xs text-slate-500 hover:text-slate-300 block mx-auto mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
