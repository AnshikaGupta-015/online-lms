import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckSquare,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Send,
  Edit3,
  BookOpen,
  Award,
  Filter
} from 'lucide-react';
import { api } from '../lib/api';
import { MarkdownView } from '../components/MarkdownView';
import { Assignment, StudyNote, AssignmentSubmission } from '../types';

export const NotesAssignmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'notes' | 'assignments'>('notes');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  // Submit Modal state
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Fetch enrolled courses for dropdown
  const { data: dashboardData } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: () => api.getStudentDashboard()
  });

  const enrolledCourses = dashboardData?.allCourses || [];
  const currentCourseId = selectedCourseId || (enrolledCourses[0]?.course.id ?? '');

  // Fetch study notes for selected course
  const { data: notesData, isLoading: isLoadingNotes } = useQuery({
    queryKey: ['study-notes', currentCourseId],
    queryFn: () => api.getCourseStudyNotes(currentCourseId),
    enabled: !!currentCourseId
  });

  // Fetch all assignments across student's courses
  const { data: assignments = [], isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['my-assignments'],
    queryFn: () => api.getMyAssignments()
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: ({ id, content, linkUrl }: { id: string; content: string; linkUrl: string }) =>
      api.submitAssignment(id, { content, linkUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-assignments'] });
      setSubmittingAssignment(null);
      setSubmissionContent('');
      setSubmissionLink('');
    },
    onError: (err: any) => {
      setSubmitError(err.message || 'Failed to submit assignment');
    }
  });

  const handleOpenSubmit = (assignment: Assignment) => {
    setSubmittingAssignment(assignment);
    setSubmissionContent(assignment.userSubmission?.content || '');
    setSubmissionLink(assignment.userSubmission?.linkUrl || '');
    setSubmitError('');
  };

  const handleDownloadNotes = (title: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredAssignments = assignments.filter(a => {
    const sub = a.userSubmission;
    if (assignmentFilter === 'pending') return !sub || sub.status === 'not_started';
    if (assignmentFilter === 'submitted') return sub && (sub.status === 'submitted' || sub.status === 'late');
    if (assignmentFilter === 'graded') return sub && sub.status === 'graded';
    return true;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0056D2] dark:text-blue-400">
              <BookOpen className="w-4 h-4" />
              <span>Academic Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Study Guides & Assignments
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Section lecture notes, cheat sheets, practical assignments, and faculty evaluations.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-slate-900 text-[#0056D2] dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Study Notes ({notesData?.studyNotes?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'assignments'
                  ? 'bg-white dark:bg-slate-900 text-[#0056D2] dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Assignments ({assignments.length})</span>
            </button>
          </div>
        </div>

        {/* ---------------- NOTES TAB ---------------- */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Course Selector Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Enrolled Course:
                </span>
                <select
                  value={currentCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0056D2]"
                >
                  {enrolledCourses.map(c => (
                    <option key={c.course.id} value={c.course.id}>
                      {c.course.title}
                    </option>
                  ))}
                </select>
              </div>

              {notesData && (
                <button
                  type="button"
                  onClick={() => {
                    const fullDoc = (notesData.studyNotes || [])
                      .map(n => `# ${n.title}\n\n${n.content}\n\n---\n`)
                      .join('\n');
                    handleDownloadNotes(`${notesData.courseTitle}-all-notes`, fullDoc);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Complete Course Notes (.md)</span>
                </button>
              )}
            </div>

            {isLoadingNotes ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-44 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : !notesData || notesData.studyNotes.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  No Section Notes Available
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Enroll in published courses to access comprehensive section guides and technical cheat sheets.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {notesData.studyNotes.map(note => (
                  <div
                    key={note.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                  >
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
                      <div>
                        <span className="text-[11px] font-semibold text-[#0056D2] dark:text-blue-400 uppercase tracking-wider">
                          {note.sectionTitle}
                        </span>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {note.title}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadNotes(note.title, note.content)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Download Section Notes</span>
                      </button>
                    </div>

                    <div className="p-6">
                      <MarkdownView content={note.content} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- ASSIGNMENTS TAB ---------------- */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-slate-400 mr-1" />
                {[
                  { id: 'all', label: 'All Assignments' },
                  { id: 'pending', label: 'Pending Submission' },
                  { id: 'submitted', label: 'Submitted' },
                  { id: 'graded', label: 'Graded & Feedback' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setAssignmentFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      assignmentFilter === f.id
                        ? 'bg-[#0056D2] text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500">
                Showing {filteredAssignments.length} assignment{filteredAssignments.length === 1 ? '' : 's'}
              </span>
            </div>

            {isLoadingAssignments ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-36 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                <CheckSquare className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  No Assignments Found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  There are no assignments matching the selected filter.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAssignments.map(asg => {
                  const sub = asg.userSubmission;
                  const isSubmitted = sub && (sub.status === 'submitted' || sub.status === 'late');
                  const isGraded = sub && sub.status === 'graded';
                  const isPastDue = new Date() > new Date(asg.dueDate);

                  return (
                    <div
                      key={asg.id}
                      className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-[#0056D2] dark:text-blue-400 uppercase tracking-wider">
                            {asg.courseTitle}
                          </span>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base">
                            {asg.title}
                          </h3>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isGraded ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60">
                              <Award className="w-3.5 h-3.5" />
                              <span>Graded: {sub.marks} / {asg.maxMarks}</span>
                            </span>
                          ) : isSubmitted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#0056D2] dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Submitted &bull; Awaiting Review</span>
                            </span>
                          ) : isPastDue ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Past Due</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Due Soon</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="text-xs text-slate-600 dark:text-slate-300 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <MarkdownView content={asg.instructions} />
                      </div>

                      {/* Evaluated Feedback Box if graded */}
                      {isGraded && (
                        <div className="p-4 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            <span>Instructor Feedback & Score</span>
                            <span>Score: {sub.marks} / {asg.maxMarks}</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-200">
                            {sub.feedback || 'Excellent submission that fulfills all criteria.'}
                          </p>
                        </div>
                      )}

                      {/* Actions & Metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              Due:{' '}
                              {new Date(asg.dueDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </span>
                          <span>Max Marks: {asg.maxMarks}</span>
                          <span className="capitalize">Format: {asg.type}</span>
                        </div>

                        <div>
                          {!isGraded ? (
                            <button
                              type="button"
                              onClick={() => handleOpenSubmit(asg)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold shadow-sm transition-colors"
                            >
                              {isSubmitted ? (
                                <>
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit Submission</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Submit Assignment</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              Evaluation Finalized
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {submittingAssignment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Submit Assignment
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {submittingAssignment.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubmittingAssignment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                submitMutation.mutate({
                  id: submittingAssignment.id,
                  content: submissionContent,
                  linkUrl: submissionLink
                });
              }}
              className="p-6 space-y-4"
            >
              {(submittingAssignment.type === 'written' || submittingAssignment.type === 'both') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Written Explanation / Code Solution (Markdown supported)
                  </label>
                  <textarea
                    rows={6}
                    value={submissionContent}
                    onChange={e => setSubmissionContent(e.target.value)}
                    placeholder="Describe your architecture, paste code blocks, or explain how you solved edge cases..."
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056D2] font-mono text-slate-900 dark:text-white"
                  />
                </div>
              )}

              {(submittingAssignment.type === 'link' || submittingAssignment.type === 'both') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    External Repository or Live Demo URL (e.g. GitHub, Figma, Vercel)
                  </label>
                  <input
                    type="url"
                    value={submissionLink}
                    onChange={e => setSubmissionLink(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056D2] text-slate-900 dark:text-white"
                  />
                </div>
              )}

              {submitError && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {submitError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending || (!submissionContent && !submissionLink)}
                  className="px-5 py-2 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
