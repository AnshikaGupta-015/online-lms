import React, { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LifeBuoy, Plus, Loader2, MessageSquare, MapPin, X, Send } from 'lucide-react';
import { api } from '../lib/api';
import { TicketCategory, TicketPriority } from '../types';
import { TicketThread } from '../components/TicketThread';
import { CATEGORY_LABELS, PRIORITY_LABELS, StatusBadge, formatTicketDate } from '../components/TicketBadges';

const SUBJECT_MAX = 120;
const DESCRIPTION_MAX = 4000;

const inputClass =
  'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500';

const NewTicketForm: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const presetCategory = searchParams.get('category') as TicketCategory | null;
  const [category, setCategory] = useState<TicketCategory>(
    presetCategory && presetCategory in CATEGORY_LABELS ? presetCategory : 'bug'
  );
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  // Page where the user hit the problem (passed by the "Help & Support" links)
  const rawFrom = searchParams.get('from') || '';
  const [pageUrl, setPageUrl] = useState(rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : '');
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: () =>
      api.createSupportTicket({
        subject: subject.trim(),
        category,
        priority,
        description: description.trim(),
        pageUrl: pageUrl || undefined
      }),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
      queryClient.invalidateQueries({ queryKey: ['adminSupportTickets'] });
      navigate(`/support/${ticket.id}`);
    },
    onError: (e: Error) => setError(e.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (subject.trim().length < 5) return setError('Please add a short subject (at least 5 characters).');
    if (description.trim().length < 10) return setError('Please describe the problem in a little more detail.');
    createMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs p-6 space-y-4"
    >
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Report a problem or file a complaint</h2>
        <p className="text-xs text-slate-500 mt-1">
          Tell us what went wrong. Our team will reply here, and you can follow the conversation any time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1.5 block">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">What is this about?</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)} className={inputClass}>
            {(Object.keys(CATEGORY_LABELS) as TicketCategory[]).map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 block">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">How urgent is it?</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} className={inputClass}>
            {(Object.keys(PRIORITY_LABELS) as TicketPriority[]).map((p) => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-1.5 block">
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Subject</span>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={SUBJECT_MAX}
          placeholder="e.g. Video not playing in lesson 3"
          className={inputClass}
        />
      </label>

      <label className="space-y-1.5 block">
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Describe the problem</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={DESCRIPTION_MAX}
          rows={7}
          placeholder="What were you doing? What did you expect, and what happened instead? Copy any error message you saw."
          className={`${inputClass} resize-y`}
        />
        <span className="block text-right text-[10px] text-slate-400">
          {description.length}/{DESCRIPTION_MAX}
        </span>
      </label>

      {pageUrl && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5" />
          <span>Reported from <code className="font-mono">{pageUrl}</code></span>
          <button type="button" onClick={() => setPageUrl('')} aria-label="Remove page info" className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs">{error}</div>
      )}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold shadow-xs"
      >
        {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Submit ticket
      </button>
    </form>
  );
};

export const SupportPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId?: string }>();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['supportTickets'],
    queryFn: () => api.getMySupportTickets()
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <LifeBuoy className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
          <p className="text-xs text-slate-500">Found an error or have a complaint? Raise a ticket and we will get back to you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* My tickets (on mobile the form/thread comes first, the list below) */}
        <aside className={`lg:col-span-1 order-2 lg:order-1 space-y-3 ${ticketId ? 'hidden lg:block' : ''}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">My tickets</h3>
            <Link
              to="/support"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> New ticket
            </Link>
          </div>

          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            </div>
          ) : !tickets || tickets.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center space-y-2">
              <MessageSquare className="w-6 h-6 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No tickets yet. Anything you report will show up here.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {tickets.map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/support/${t.id}`}
                    className={`block p-3.5 rounded-xl border transition-colors ${
                      t.id === ticketId
                        ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] text-slate-400">{t.ticketNumber}</span>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2">{t.subject}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {t.messages.length} message{t.messages.length === 1 ? '' : 's'} · updated {formatTicketDate(t.updatedAt)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Form or conversation */}
        <section className="lg:col-span-2 order-1 lg:order-2">
          {ticketId ? <TicketThread key={ticketId} ticketId={ticketId} backTo="/support" /> : <NewTicketForm />}
        </section>
      </div>
    </div>
  );
};
