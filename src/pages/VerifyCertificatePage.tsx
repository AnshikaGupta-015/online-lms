import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const VerifyCertificatePage: React.FC = () => {
  const { code: paramCode } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(paramCode || '');
  const activeCode = paramCode?.trim().toUpperCase() || '';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['verifyCertificate', activeCode],
    queryFn: () => api.verifyCertificate(activeCode),
    enabled: !!activeCode,
    retry: false
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/verify/${encodeURIComponent(searchInput.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Public Credential Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verify LearnHub Certificate
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Instantly authenticate official credentials issued by LearnHub. Each certificate is cryptographically recorded with unique tamper-evident code.
          </p>
        </div>

        {/* Verification Lookup Input */}
        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              placeholder="Enter Credential ID (e.g., LH-2026-X7K9P2M4QA)..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs shrink-0 transition-colors"
            >
              Verify Credential
            </button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Querying registry database for {activeCode}...</p>
          </div>
        )}

        {/* NOT FOUND / ERROR STATE */}
        {!isLoading && activeCode && (isError || !data?.valid) && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-8 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {data?.revoked ? 'Certificate Has Been Revoked' : 'Certificate Not Found'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {data?.revoked
                    ? `This credential was officially revoked by platform administration on ${new Date(data.revokedAt || '').toLocaleDateString()}. Reason: ${data.revokedReason || 'Academic compliance audit'}.`
                    : `No active credential matching ID "${activeCode}" exists in the LearnHub registry. Please check for typos or ask the certificate holder to provide the official link.`}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="font-mono text-slate-400">ID: {activeCode}</span>
              <Link
                to="/courses"
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Browse Accredited Courses →
              </Link>
            </div>
          </div>
        )}

        {/* VALID CERTIFICATE RECORD */}
        {!isLoading && data && data.valid && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/40 p-8 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
            
            {/* Top Verified Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span>Verified & Authentic</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Official LearnHub Credential
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Credential ID</span>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 select-all">
                  {data.code || data.certificateId}
                </span>
              </div>
            </div>

            {/* Recipient & Course Details */}
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Issued To
                </span>
                <h3 className="text-2xl font-serif font-extrabold text-slate-900 dark:text-white">
                  {data.studentName}
                </h3>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Curriculum Completed
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {data.courseTitle}
                </h4>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Instructor: <strong className="text-slate-700 dark:text-slate-300">{data.instructorName}</strong></span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{(data.totalDurationMinutes / 60).toFixed(1)} Accredited Hours</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{data.totalLessons} Lessons Mastered</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Issue Date</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {new Date(data.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid & Active
                  </span>
                </div>
              </div>
            </div>

            {/* Action link */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Digitally authenticated on LearnHub
              </span>
              <Link
                to={`/certificate/${data.code || data.certificateId}`}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <span>View Full Certificate Sheet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

        {/* Informational Guidance */}
        {!activeCode && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              About LearnHub Certificate Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every LearnHub course certificate bears a unique alphanumeric code formatted as <code className="font-mono font-bold text-indigo-600">LH-YYYY-XXXXXXXXXX</code>. Certificates are granted only when a student achieves 100% video lesson completion and scores above the passing mark on the comprehensive accreditation exam.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
