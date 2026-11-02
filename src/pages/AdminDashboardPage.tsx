import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Role } from '../types';
import { StatCard } from '../components/StatCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { TableSkeleton } from '../components/Skeleton';
import { AdminSupportPanel } from '../components/AdminSupportPanel';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Shield,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  FolderPlus,
  RotateCcw,
  Search,
  Eye,
  Award,
  ShieldAlert,
  Calendar,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'certificates' | 'support' | 'categories' | 'analytics'>('moderation');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Certificate management state (A.8)
  const [certSearch, setCertSearch] = useState('');
  const [certCourseFilter, setCertCourseFilter] = useState('all');
  const [certStatusFilter, setCertStatusFilter] = useState<'all' | 'active' | 'revoked'>('all');
  const [certToRevoke, setCertToRevoke] = useState<any | null>(null);
  const [revokeReason, setRevokeReason] = useState('Academic compliance review');

  // Category creation state
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Code');

  // Confirm dialogs
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [resetDbConfirmOpen, setResetDbConfirmOpen] = useState(false);

  // Queries
  const { data: adminData, isLoading: isAdminLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => api.getAdminDashboard()
  });

  const { data: adminCourses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: () => api.getAdminCourses()
  });

  const { data: adminUsers, isLoading: isUsersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => api.getAdminUsers()
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories()
  });

  const { data: adminSupportTickets } = useQuery({
    queryKey: ['adminSupportTickets'],
    queryFn: () => api.getAdminSupportTickets(),
    refetchInterval: 30000
  });
  const openSupportCount = (adminSupportTickets || []).filter(t => t.status === 'open' || t.status === 'in_progress').length;

  const { data: adminCertificates, isLoading: isCertificatesLoading } = useQuery({
    queryKey: ['adminCertificates'],
    queryFn: () => api.getAdminCertificates()
  });

  // Mutations
  const revokeCertMutation = useMutation({
    mutationFn: ({ code, reason }: { code: string; reason: string }) => api.revokeCertificate(code, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCertificates'] });
      setCertToRevoke(null);
    }
  });

  const restoreCertMutation = useMutation({
    mutationFn: (code: string) => api.restoreCertificate(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCertificates'] });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.updateCourseStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    }
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) => api.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setUserToDelete(null);
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: (payload: { name: string; icon: string }) => api.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCatName('');
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const resetDbMutation = useMutation({
    mutationFn: () => api.resetDatabase(),
    onSuccess: () => {
      queryClient.invalidateQueries();
      setResetDbConfirmOpen(false);
      window.location.reload();
    }
  });

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <TableSkeleton rows={4} />
        </div>
      </div>
    );
  }

  const stats = adminData?.stats || { totalUsers: 0, totalCourses: 0, totalEnrollments: 0, totalRevenue: 0 };
  const enrollmentTrends = adminData?.enrollmentTrends || [];
  const coursesByCategory = adminData?.coursesByCategory || [];

  // Filtered Users
  const filteredUsers = (adminUsers || []).filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER STRIP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              Platform Administration & Moderation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Administrative Control Console
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Audit submitted curriculum, manage role permissions, monitor platform revenue, and supervise platform health.
            </p>
          </div>

          {import.meta.env.VITE_DEMO_MODE === 'true' && (
            <button
              onClick={() => setResetDbConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/60 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Fresh Seed DB</span>
            </button>
          )}
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Platform Users"
            value={stats.totalUsers}
            subtitle="Admins, instructors, scholars"
            icon={<Users className="w-5 h-5 text-indigo-500" />}
          />
          <StatCard
            label="Total Courses"
            value={stats.totalCourses}
            subtitle="Catalog inventory"
            icon={<BookOpen className="w-5 h-5 text-violet-500" />}
          />
          <StatCard
            label="Total Enrollments"
            value={stats.totalEnrollments}
            subtitle="Verified course registrations"
            icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          />
          <StatCard
            label="Platform Gross Revenue"
            value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
            subtitle="Aggregated transaction volume"
            icon={<DollarSign className="w-5 h-5 text-amber-500" />}
          />
        </div>

        {/* TABS */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('moderation')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'moderation'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Course Moderation ({adminCourses?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              User Management ({adminUsers?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'certificates'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificates ({adminCertificates?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'support'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Support Tickets ({openSupportCount} open)</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Trends & Distribution
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'categories'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Categories ({categories?.length || 0})
            </button>
          </div>

          {/* TAB 1: COURSE MODERATION */}
          {activeTab === 'moderation' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Course & Instructor</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Enrollments</th>
                      <th className="px-5 py-3.5 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {adminCourses?.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={course.thumbnailUrl}
                              alt=""
                              className="w-12 h-8 rounded-lg object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="max-w-xs sm:max-w-md truncate">
                              <div className="font-bold text-slate-900 dark:text-white truncate">
                                {course.title}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Instructor: {course.instructor?.fullName}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                          {course.category?.name || 'General'}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              course.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                : course.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                            }`}
                          >
                            {course.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                          {course.aggregates?.enrollmentCount || 0}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {course.status !== 'published' && (
                              <button
                                onClick={() =>
                                  updateStatusMutation.mutate({ id: course.id, status: 'published' })
                                }
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                                title="Approve & Publish"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}

                            {course.status !== 'rejected' && (
                              <button
                                onClick={() =>
                                  updateStatusMutation.mutate({ id: course.id, status: 'rejected' })
                                }
                                className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                                title="Reject"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            )}

                            <a
                              href={`/courses/${course.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                              title="Inspect Course"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              
              {/* Search & Role Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Filter role:</span>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="instructor">Instructors</option>
                    <option value="admin">Administrators</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3.5">User Profile</th>
                        <th className="px-5 py-3.5">Current Role</th>
                        <th className="px-5 py-3.5">Assigned Courses</th>
                        <th className="px-5 py-3.5">Change Role</th>
                        <th className="px-5 py-3.5 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.fullName)}`}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {u.fullName}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'admin'
                                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                  : u.role === 'instructor'
                                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400'
                                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td className="px-5 py-4 font-mono tabular-nums text-slate-500">
                            {u.enrollmentsCount} courses
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={u.role}
                              onChange={(e) =>
                                updateUserRoleMutation.mutate({ userId: u.id, role: e.target.value as Role })
                              }
                              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="student">Student</option>
                              <option value="instructor">Instructor</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB: ACCREDITED CERTIFICATES (A.8) */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              
              {/* Search & Filter Controls */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={certSearch}
                    onChange={(e) => setCertSearch(e.target.value)}
                    placeholder="Search by code, scholar name, or email..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Course Filter */}
                  <select
                    value={certCourseFilter}
                    onChange={(e) => setCertCourseFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="all">All Courses</option>
                    {adminCourses?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={certStatusFilter}
                    onChange={(e) => setCertStatusFilter(e.target.value as any)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active & Verified</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>

              </div>

              {/* Certificates Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-xs">
                {isCertificatesLoading ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Loading credentials registry...
                  </div>
                ) : (adminCertificates || []).length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No certificates have been issued yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-800">
                        <tr>
                          <th className="px-5 py-3.5">Certificate Code</th>
                          <th className="px-5 py-3.5">Student / Recipient</th>
                          <th className="px-5 py-3.5">Accredited Course</th>
                          <th className="px-5 py-3.5">Issued Date</th>
                          <th className="px-5 py-3.5">Status</th>
                          <th className="px-5 py-3.5 text-right">Administrative Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(adminCertificates || [])
                          .filter((cert) => {
                            const query = certSearch.toLowerCase().trim();
                            const matchesSearch =
                              !query ||
                              cert.code.toLowerCase().includes(query) ||
                              cert.studentName.toLowerCase().includes(query) ||
                              cert.studentEmail.toLowerCase().includes(query) ||
                              cert.courseTitle.toLowerCase().includes(query);
                            const matchesCourse = certCourseFilter === 'all' || cert.courseId === certCourseFilter;
                            const matchesStatus =
                              certStatusFilter === 'all' ||
                              (certStatusFilter === 'active' && !cert.revoked) ||
                              (certStatusFilter === 'revoked' && cert.revoked);
                            return matchesSearch && matchesCourse && matchesStatus;
                          })
                          .map((cert) => (
                            <tr key={cert.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                              <td className="px-5 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                <a
                                  href={`/certificate/${cert.code}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline flex items-center gap-1"
                                >
                                  <span>{cert.code}</span>
                                  <ExternalLink className="w-3 h-3 opacity-60" />
                                </a>
                              </td>

                              <td className="px-5 py-4">
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {cert.studentName}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">
                                  {cert.studentEmail}
                                </div>
                              </td>

                              <td className="px-5 py-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                                {cert.courseTitle}
                              </td>

                              <td className="px-5 py-4 text-slate-500 font-mono text-[11px]">
                                {new Date(cert.issuedAt).toLocaleDateString()}
                              </td>

                              <td className="px-5 py-4">
                                {cert.revoked ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                                    <ShieldAlert className="w-3 h-3" />
                                    Revoked
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                    <CheckCircle className="w-3 h-3" />
                                    Active
                                  </span>
                                )}
                                {cert.revoked && cert.revokedReason && (
                                  <div className="text-[10px] text-rose-500 mt-0.5 truncate max-w-xs">
                                    {cert.revokedReason}
                                  </div>
                                )}
                              </td>

                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <a
                                    href={`/verify/${cert.code}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-[11px] font-semibold transition-colors"
                                  >
                                    Verify
                                  </a>

                                  {cert.revoked ? (
                                    <button
                                      onClick={() => restoreCertMutation.mutate(cert.code)}
                                      disabled={restoreCertMutation.isPending}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition-colors disabled:opacity-50"
                                    >
                                      Restore
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => setCertToRevoke(cert)}
                                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 rounded-lg text-[11px] font-semibold transition-colors"
                                    >
                                      Revoke
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: ANALYTICS & TRENDS (RECHARTS) */}
          {/* TAB: CUSTOMER SUPPORT */}
          {activeTab === 'support' && <AdminSupportPanel />}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Enrollment & Revenue Chart */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Enrollment Trajectory (Monthly)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active student registrations over the past 6 months
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollmentTrends}>
                      <defs>
                        <linearGradient id="colorEnr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '8px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                      <Area type="monotone" dataKey="enrollments" stroke="#6366f1" fillOpacity={1} fill="url(#colorEnr)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Courses by Category Bar Chart */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Course Distribution by Category
                  </h3>
                  <p className="text-xs text-slate-500">
                    Catalog concentration across technology domains
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coursesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '8px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="courses" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: CATEGORY MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Add category form */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-4 h-fit">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-indigo-500" />
                  Add New Category
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g., Quantum Computing"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Icon Glyph
                    </label>
                    <select
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value="Code">Code</option>
                      <option value="Cloud">Cloud</option>
                      <option value="Cpu">Cpu</option>
                      <option value="Palette">Palette</option>
                      <option value="ShieldCheck">ShieldCheck</option>
                      <option value="BarChart3">BarChart3</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Layers">Layers</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (newCatName.trim()) {
                        createCategoryMutation.mutate({ name: newCatName.trim(), icon: newCatIcon });
                      }
                    }}
                    disabled={createCategoryMutation.isPending || !newCatName.trim()}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors disabled:opacity-50"
                  >
                    Create Category
                  </button>
                </div>
              </div>

              {/* Categories list */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Category Name</th>
                      <th className="px-5 py-3.5">Slug</th>
                      <th className="px-5 py-3.5">Course Count</th>
                      <th className="px-5 py-3.5 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categories?.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                          {cat.name}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px]">
                          {cat.slug}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                          {cat.courseCount || 1}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => deleteCategoryMutation.mutate(cat.id)}
                            className="p-1 text-rose-500 hover:text-rose-700"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* CONFIRM DELETE USER DIALOG */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        title="Delete User Account?"
        message={`Are you sure you want to permanently delete user ${userToDelete?.email}? This action cascades and deletes their enrollments and progress.`}
        confirmText="Delete Account"
        confirmVariant="danger"
        onConfirm={() => userToDelete && deleteUserMutation.mutate(userToDelete.id)}
        onCancel={() => setUserToDelete(null)}
      />

      {/* REVOKE CERTIFICATE DIALOG (A.8) */}
      {certToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Revoke Certificate {certToRevoke.code}?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Recipient: <strong className="text-slate-700 dark:text-slate-300">{certToRevoke.studentName}</strong>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Revocation Reason (Recorded on public registry)
              </label>
              <textarea
                rows={3}
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Enter official justification..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCertToRevoke(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  revokeCertMutation.mutate({ code: certToRevoke.code, reason: revokeReason })
                }
                disabled={revokeCertMutation.isPending || !revokeReason.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50"
              >
                {revokeCertMutation.isPending ? 'Revoking...' : 'Confirm Revocation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET DATABASE DIALOG (D.3: requires typing RESET) */}
      <ConfirmDialog
        isOpen={resetDbConfirmOpen}
        title="Reset Entire Database to Seed State?"
        message="This will re-initialize the verified seed dataset: 1 admin, 2 instructors, 3 students, 42 published courses with lessons, sample reviews, and certificates. Any newly created test records will be refreshed."
        confirmText="Reset Database to Seed"
        confirmVariant="danger"
        requireConfirmationText="RESET"
        onConfirm={() => resetDbMutation.mutate()}
        onCancel={() => setResetDbConfirmOpen(false)}
      />

    </div>
  );
};
