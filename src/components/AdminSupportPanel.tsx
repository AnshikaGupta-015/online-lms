import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, Inbox } from 'lucide-react';
import { api } from '../lib/api';
import { TicketCategory, TicketStatus } from '../types';
import { TicketThread } from './TicketThread';
import { CATEGORY_LABELS, STATUS_LABELS, StatusBadge, PriorityBadge, formatTicketDate } from './TicketBadges';

export const AdminSupportPanel: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | TicketStatus>('active');
  const [categoryFilter, setCategoryFilter] = useState<'all' | TicketCategory>('all');
  const [search, setSearch] = useState('');

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['adminSupportTickets'],
    queryFn: () => api.getAdminSupportTickets(),
    refetchInterval: 30000
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (tickets || []).filter((t) => {
      if (statusFilter === 'active' && (t.status === 'resolved' || t.status === 'closed')) return false;
      if (statusFilter !== 'all' && statusFilter !== 'active' && t.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        t.subject.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.userName.toLowerCase().includes(q) ||
        t.userEmail.toLowerCase().includes(q)
      );
    });
  }, [tickets, statusFilter, categoryFilter, search]);

  if (selectedId) {
    return <TicketThread key={selectedId} ticketId={selectedId} isAdminView onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket no., subject, name or email"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        >
          <option value="active">Needs attention (open + in progress)</option>
          <option value="all">All statuses</option>
          {(Object.keys(STATUS_LABELS) as TicketStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as any)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        >
          <option value="all">All categories</option>
          {(Object.keys(CATEGORY_LABELS) as TicketCategory[]).map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Inbox className="w-7 h-7 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No tickets match these filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Ticket</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Last activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 max-w-[280px]">
                      <div className="font-mono text-[10px] text-slate-400">{t.ticketNumber}</div>
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{t.subject}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-800 dark:text-slate-100">{t.userName}</div>
                      <div className="text-[10px] text-slate-400">{t.userEmail}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{CATEGORY_LABELS[t.category]}</td>
                    <td className="px-5 py-3.5"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-5 py-3.5"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{formatTicketDate(t.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
