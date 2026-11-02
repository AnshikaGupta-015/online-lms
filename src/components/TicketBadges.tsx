import React from 'react';
import { TicketCategory, TicketPriority, TicketStatus } from '../types';

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  bug: 'Error / Something is broken',
  payment: 'Payment & Billing',
  course: 'Course or Video issue',
  certificate: 'Certificate issue',
  account: 'Login & Account',
  feedback: 'Complaint / Feedback',
  other: 'Other'
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High (blocking me)'
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

const STATUS_STYLES: Record<TicketStatus, string> = {
  open: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  in_progress: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
  resolved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  closed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
};

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  medium: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  high: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
};

export const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[status]}`}>
    {STATUS_LABELS[status]}
  </span>
);

export const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${PRIORITY_STYLES[priority]}`}>
    {priority}
  </span>
);

export const formatTicketDate = (iso: string): string =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
