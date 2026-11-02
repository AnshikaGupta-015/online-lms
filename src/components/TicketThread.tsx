import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Send, Loader2, LifeBuoy, MapPin, Mail, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { SupportTicket, TicketStatus } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS, StatusBadge, PriorityBadge, formatTicketDate } from './TicketBadges';

interface TicketThreadProps {
  ticketId: string;
  /** Admin view shows customer details and the full status dropdown */
  isAdminView?: boolean;
  backTo?: string;
  onBack?: () => void;
}

export const TicketThread: React.FC<TicketThreadProps> = ({ ticketId, isAdminView = false, backTo, onBack }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: ticket, isLoading, error: loadError } = useQuery({
    queryKey: ['supportTicket', ticketId],
    queryFn: () => api.getSupportTicket(ticketId),
    // Pick up new replies without needing a manual refresh
    refetchInterval: 20000
  });

  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
    queryClient.invalidateQueries({ queryKey: ['adminSupportTickets'] });
  };

  const onTicketUpdated = (updated: SupportTicket) => {
    queryClient.setQueryData(['supportTicket', ticketId], updated);
    refreshLists();
  };

  const replyMutation = useMutation({
    mutationFn: (content: string) => api.replyToSupportTicket(ticketId, content),
    onSuccess: (updated) => {
      setReply('');
      setError('');
      onTicketUpdated(updated);
    },
    onError: (e: Error) => setError(e.message)
  });

  const statusMutation = useMutation({
    mutationFn: (status: TicketStatus) => api.updateSupportTicketStatus(ticketId, status),
    onSuccess: (updated) => {
      setError('');
      onTicketUpdated(updated);
    },
    onError: (e: Error) => setError(e.message)
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [ticket?.messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || replyMutation.isPending) return;
    replyMutation.mutate(reply.trim());
  };

  const backControl = backTo ? (
    <Link to={backTo} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
      <ArrowLeft className="w-3.5 h-3.5" /> Back
    </Link>
  ) : onBack ? (
    <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
      <ArrowLeft className="w-3.5 h-3.5" /> Back to all tickets
    </button>
  ) : null;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (loadError || !ticket) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
        <AlertCircle className="w-6 h-6 text-rose-500 mx-auto" />
        <p className="text-xs text-slate-500">{(loadError as Error)?.message || 'Ticket not found.'}</p>
        {backControl}
      </div>
    );
  }

  const isClosed = ticket.status === 'closed';
  const isOwner = ticket.userId === user?.id;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
        {backControl}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="font-mono text-[11px] text-slate-400">{ticket.ticketNumber}</div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white break-words">{ticket.subject}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
          <span>{CATEGORY_LABELS[ticket.category]}</span>
          <span>Opened {formatTicketDate(ticket.createdAt)}</span>
          {ticket.pageUrl && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" /> <code className="text-[10px]">{ticket.pageUrl}</code>
            </span>
          )}
          {isAdminView && (
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3 h-3" /> {ticket.userName} · {ticket.userEmail}
            </span>
          )}
        </div>

        {/* Status controls */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isAdminView ? (
            <label className="flex items-center gap-2 text-[11px] text-slate-500">
              Status
              <select
                value={ticket.status}
                disabled={statusMutation.isPending}
                onChange={(e) => statusMutation.mutate(e.target.value as TicketStatus)}
                className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              >
                {(Object.keys(STATUS_LABELS) as TicketStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </label>
          ) : isOwner && (
            isClosed ? (
              <button
                onClick={() => statusMutation.mutate('open')}
                disabled={statusMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reopen ticket
              </button>
            ) : (
              <button
                onClick={() => statusMutation.mutate('closed')}
                disabled={statusMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> My issue is solved. Close ticket
              </button>
            )
          )}
        </div>
      </div>

      {/* Conversation */}
      <div className="p-5 space-y-4 max-h-[460px] overflow-y-auto bg-slate-50/60 dark:bg-slate-950/40">
        {ticket.messages.map((m) => {
          const mine = m.authorId === user?.id;
          const isStaff = m.authorRole === 'admin' && m.authorId !== ticket.userId;
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                mine
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-md'
              }`}>
                <div className={`flex items-center gap-2 mb-1 text-[10px] font-semibold ${mine ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {isStaff && <LifeBuoy className="w-3 h-3" />}
                  <span>{isStaff ? `${m.authorName} · LearnHub Support` : mine ? 'You' : m.authorName}</span>
                  <span className="font-normal opacity-80">{formatTicketDate(m.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply box */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {error && <p className="text-[11px] text-rose-600 dark:text-rose-400">{error}</p>}
        {isClosed ? (
          <p className="text-xs text-slate-500">
            This ticket is closed.{!isAdminView && isOwner ? ' Reopen it above if you still need help.' : ''}
          </p>
        ) : (
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              maxLength={2000}
              rows={2}
              placeholder={isAdminView ? 'Reply to the customer...' : 'Add more details or reply to support...'}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!reply.trim() || replyMutation.isPending}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              {replyMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
