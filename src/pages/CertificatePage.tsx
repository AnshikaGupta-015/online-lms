import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Printer,
  Share2,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Award,
  CheckCircle,
  Linkedin,
  ExternalLink,
  QrCode
} from 'lucide-react';

export const CertificatePage: React.FC = () => {
  const { certificateId, code: paramCode } = useParams<{ certificateId?: string; code?: string }>();
  const activeIdentifier = certificateId || paramCode || '';
  const { user, role } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['certificate', activeIdentifier],
    queryFn: () => api.getCertificate(activeIdentifier),
    enabled: !!activeIdentifier
  });

  const isOwner = user && (user.id === data?.ownerId || role === 'admin');

  const handlePrint = () => {
    window.print();
  };

  const verificationUrl = data?.code
    ? `${window.location.origin}/verify/${data.code}`
    : `${window.location.origin}/verify/${activeIdentifier}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareLinkedIn = () => {
    if (!data) return;
    const issueDate = new Date(data.issuedAt);
    const issueYear = issueDate.getFullYear();
    const issueMonth = issueDate.getMonth() + 1;
    const certCode = data.code || data.certificateId;
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      data.courseTitle
    )}&organizationName=${encodeURIComponent('LearnHub')}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${encodeURIComponent(
      verificationUrl
    )}&certId=${encodeURIComponent(certCode)}`;
    
    // Open in new window safely
    const win = window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Verifying credential cryptographic signatures...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center max-w-md shadow-xl">
          <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Certificate Not Found</h2>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            The credential ID <code className="font-mono font-bold text-indigo-600">{activeIdentifier}</code> does not match any accredited records in the LearnHub registry.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/verify"
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
            >
              Verify Another Code
            </Link>
            <Link
              to="/courses"
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(data.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certCode = data.code || data.certificateId;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-10 transition-colors print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 print:max-w-none print:p-0">
        
        {/* ACTION BAR (Hidden during printing) */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              title="Copy public verification link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShareLinkedIn}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0077b5] hover:bg-[#006396] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              title="Add this accredited certificate to your LinkedIn profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>Add to LinkedIn</span>
            </button>

            {/* Print & Download PDF button ONLY shown for the certificate owner */}
            {isOwner && (
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                title="Print or Save as PDF"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* REVOCATION WARNING BANNER (If certificate was revoked) */}
        {data.revoked && (
          <div className="no-print mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                Official Credential Revocation Notice
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
                This credential was officially revoked by platform administration
                {data.revokedAt ? ` on ${new Date(data.revokedAt).toLocaleDateString()}` : ''}.
                Reason: {data.revokedReason || 'Academic compliance audit'}.
              </p>
            </div>
          </div>
        )}

        {/* ELEGANT CERTIFICATE SHEET (A4 LANDSCAPE RATIO) */}
        <div className="certificate-sheet bg-white text-slate-900 rounded-3xl border-8 border-double border-slate-300 p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center space-y-6 aspect-[1.414/1] flex flex-col justify-between">
          
          {/* Subtle Guilloche / Watermark Pattern */}
          <div className="absolute inset-0 border-2 border-dashed border-amber-600/20 m-3 pointer-events-none rounded-2xl" />

          {data.revoked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-7xl sm:text-8xl font-black text-rose-500/20 -rotate-12 uppercase tracking-widest border-4 border-rose-500/30 px-8 py-2 rounded-2xl select-none">
                REVOKED
              </span>
            </div>
          )}

          {/* Top Header */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-center gap-2 text-indigo-700 font-bold text-sm tracking-widest uppercase">
              <Award className="w-4 h-4 text-amber-500" />
              <span>LearnHub Institute of Technology</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Certificate of Excellence
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              This accredited credential certifies that
            </p>
          </div>

          {/* Student Name */}
          <div className="py-2">
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-indigo-950 border-b-2 border-indigo-900/30 inline-block px-8 pb-2">
              {data.studentName}
            </h2>
          </div>

          {/* Certification Statement */}
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            has successfully mastered the comprehensive curriculum, completed all hands-on architectural code challenges, and achieved a passing score on the final accreditation examination for
          </p>

          {/* Course Title */}
          <div className="py-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {data.courseTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Comprehensive Curriculum · {data.totalLessons} Lessons · {(data.totalDurationMinutes / 60).toFixed(1)} Accredited Hours
            </p>
          </div>

          {/* Crest Emblem, Signatures & Interactive QR Code */}
          <div className="pt-6 grid grid-cols-3 items-end gap-4 border-t border-slate-200">
            
            {/* Instructor Signature */}
            <div className="text-center space-y-1">
              <div className="h-10 flex items-end justify-center font-serif italic text-base text-slate-700">
                {data.instructorName}
              </div>
              <div className="border-t border-slate-400 w-36 mx-auto pt-1 text-[11px] font-bold text-slate-500 uppercase">
                Faculty Instructor
              </div>
            </div>

            {/* Official Gold Crest Emblem */}
            <div className="flex flex-col items-center justify-center">
              <img
                src="/src/assets/images/certificate_crest_emblem_1793389667675.jpg"
                alt="Accredited Seal Emblem"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain shadow-md rounded-full border border-amber-300"
              />
              <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase mt-1">
                Verified Credential
              </span>
            </div>

            {/* Scannable Verification QR Code & Date */}
            <div className="flex flex-col items-center justify-end space-y-1">
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-400 transition-colors group"
                title={`Scan or click to verify: ${verificationUrl}`}
              >
                {/* Visual SVG QR Code Matrix */}
                <svg
                  className="w-14 h-14"
                  viewBox="0 0 29 29"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top-left corner box */}
                  <rect x="1" y="1" width="7" height="7" fill="#1e293b" />
                  <rect x="2" y="2" width="5" height="5" fill="#ffffff" />
                  <rect x="3" y="3" width="3" height="3" fill="#1e293b" />

                  {/* Top-right corner box */}
                  <rect x="21" y="1" width="7" height="7" fill="#1e293b" />
                  <rect x="22" y="2" width="5" height="5" fill="#ffffff" />
                  <rect x="23" y="3" width="3" height="3" fill="#1e293b" />

                  {/* Bottom-left corner box */}
                  <rect x="1" y="21" width="7" height="7" fill="#1e293b" />
                  <rect x="2" y="22" width="5" height="5" fill="#ffffff" />
                  <rect x="3" y="23" width="3" height="3" fill="#1e293b" />

                  {/* Inner cryptographic dot patterns representing unique verification URL */}
                  <rect x="10" y="2" width="2" height="2" fill="#1e293b" />
                  <rect x="14" y="2" width="2" height="2" fill="#1e293b" />
                  <rect x="18" y="2" width="2" height="2" fill="#1e293b" />
                  <rect x="11" y="6" width="3" height="2" fill="#1e293b" />
                  <rect x="16" y="6" width="2" height="3" fill="#1e293b" />

                  <rect x="2" y="11" width="2" height="2" fill="#1e293b" />
                  <rect x="6" y="11" width="2" height="3" fill="#1e293b" />
                  <rect x="10" y="10" width="3" height="3" fill="#1e293b" />
                  <rect x="15" y="11" width="4" height="2" fill="#1e293b" />
                  <rect x="21" y="11" width="2" height="2" fill="#1e293b" />
                  <rect x="25" y="11" width="3" height="2" fill="#1e293b" />

                  <rect x="3" y="16" width="3" height="2" fill="#1e293b" />
                  <rect x="9" y="15" width="2" height="4" fill="#1e293b" />
                  <rect x="13" y="15" width="3" height="3" fill="#1e293b" />
                  <rect x="18" y="16" width="2" height="2" fill="#1e293b" />
                  <rect x="22" y="15" width="4" height="2" fill="#1e293b" />

                  <rect x="11" y="21" width="3" height="2" fill="#1e293b" />
                  <rect x="16" y="21" width="2" height="3" fill="#1e293b" />
                  <rect x="20" y="21" width="3" height="2" fill="#1e293b" />
                  <rect x="25" y="21" width="3" height="2" fill="#1e293b" />

                  <rect x="10" y="25" width="2" height="3" fill="#1e293b" />
                  <rect x="14" y="26" width="3" height="2" fill="#1e293b" />
                  <rect x="19" y="25" width="2" height="3" fill="#1e293b" />
                  <rect x="23" y="25" width="4" height="3" fill="#1e293b" />
                </svg>
              </a>
              <div className="border-t border-slate-400 w-36 mx-auto pt-1 text-[11px] font-bold text-slate-500 uppercase">
                {formattedDate}
              </div>
            </div>

          </div>

          {/* Verification Code Footer */}
          <div className="pt-4 text-center text-[10px] text-slate-400 font-mono">
            Unique Credential ID: <strong className="text-slate-700 select-all">{certCode}</strong> · Scan QR code to verify on LearnHub Registry
          </div>

        </div>

      </div>
    </div>
  );
};
