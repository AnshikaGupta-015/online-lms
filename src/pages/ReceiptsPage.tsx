import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Receipt,
  Download,
  Printer,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { api } from '../lib/api';
import { Order, formatPaise } from '../types';
import { SUPPORT_CONTACT, PLATFORM_INFO } from '../lib/constants';

export const ReceiptsPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-payments'],
    queryFn: () => api.getMyPayments()
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0056D2] dark:text-blue-400">
              <Receipt className="w-4 h-4" />
              <span>Billing & Payments</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Payment History & Tax Receipts
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View your course purchases, download formal tax invoices, and inspect UPI authorization records.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto"
          >
            <span>Browse More Courses</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-48 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Payment History
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't purchased any paid courses yet. Free course enrollments do not generate billing receipts.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0056D2] text-white text-xs font-semibold rounded-lg hover:bg-[#00419e]"
            >
              <span>Explore Paid Masterclasses</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-6">Order Details</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-6 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-200">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1">
                          {order.courseTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                        {formatPaise(order.totalAmountPaise)}
                        <span className="block text-[10px] font-normal text-slate-400">
                          (incl. 18% GST)
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-[11px] uppercase text-slate-600 dark:text-slate-300">
                          UPI {order.maskedUpiId ? `(${order.maskedUpiId})` : ''}
                        </span>
                        {order.transactionId && (
                          <span className="block text-[10px] text-slate-400 font-mono">
                            {order.transactionId}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {order.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Paid</span>
                          </span>
                        ) : order.status === 'failed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Failed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Created</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {order.status === 'paid' ? (
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#0056D2] dark:text-blue-400 text-xs font-semibold transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Printable Tax Invoice Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col">
            {/* Modal Controls (No Print) */}
            <div className="no-print flex items-center justify-between px-6 py-3 bg-slate-100 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#0056D2]" />
                Tax Invoice Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0056D2] text-white text-xs font-semibold hover:bg-[#00419e] transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Authentic Printable Invoice Sheet */}
            <div className="p-8 overflow-y-auto space-y-6 bg-white text-slate-900 print:p-0">
              {/* Invoice Header */}
              <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#0056D2] text-white flex items-center justify-center font-bold text-sm">
                      LH
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                      LearnHub LMS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    LearnHub Technologies India Private Limited
                    <br />
                    Outer Ring Road, Bengaluru, Karnataka 560103
                    <br />
                    GSTIN: 29AABCL1234F1Z8
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-slate-100 font-bold text-xs uppercase tracking-wider text-slate-800">
                    TAX INVOICE
                  </span>
                  <p className="text-xs font-mono font-bold mt-2 text-slate-900">
                    {selectedOrder.orderNumber}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Date:{' '}
                    {new Date(selectedOrder.paidAt || selectedOrder.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Billed To / Payment Details */}
              <div className="grid grid-cols-2 gap-6 text-xs pb-6 border-b border-slate-200">
                <div>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider">
                    Billed To:
                  </span>
                  <p className="font-bold text-sm text-slate-900 mt-1">
                    {selectedOrder.userName || 'Distinguished Student'}
                  </p>
                  <p className="text-slate-600">{selectedOrder.userEmail}</p>
                  <p className="text-slate-500 mt-1">Place of Supply: India (Inter-state / Intra-state)</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider">
                    Payment Confirmation:
                  </span>
                  <p className="font-semibold text-slate-900 mt-1">
                    Status: <span className="text-emerald-600 uppercase">PAID (SUCCESS)</span>
                  </p>
                  <p className="text-slate-600 font-mono">
                    Mode: UPI ({selectedOrder.maskedUpiId || 'student@upi'})
                  </p>
                  <p className="text-slate-600 font-mono">
                    Txn Ref: {selectedOrder.transactionId || 'UPI-CONFIRMED-OK'}
                  </p>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <table className="w-full text-left text-xs">
                  <thead className="border-b-2 border-slate-900 font-bold uppercase tracking-wider text-slate-800">
                    <tr>
                      <th className="py-2.5">Item Description</th>
                      <th className="py-2.5 text-center">HSN/SAC</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Taxable Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    <tr>
                      <td className="py-4">
                        <p className="font-bold text-slate-900">{selectedOrder.courseTitle}</p>
                        <p className="text-[11px] text-slate-500">
                          Comprehensive Online Course & Verified Accreditation
                        </p>
                      </td>
                      <td className="py-4 text-center font-mono text-slate-600">999293</td>
                      <td className="py-4 text-center font-semibold">1</td>
                      <td className="py-4 text-right font-semibold">
                        {formatPaise(selectedOrder.basePricePaise)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Amount</span>
                    <span className="font-semibold">{formatPaise(selectedOrder.basePricePaise)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Integrated GST (18%)</span>
                    <span className="font-semibold">{formatPaise(selectedOrder.gstPaise)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-slate-900 font-bold text-sm text-slate-900">
                    <span>Total Paid</span>
                    <span className="text-base text-[#0056D2]">
                      {formatPaise(selectedOrder.totalAmountPaise)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Computer generated electronic tax invoice. No physical signature required.
                </p>
                <p>
                  For billing questions, contact {SUPPORT_CONTACT.email} or call {SUPPORT_CONTACT.phone} ({SUPPORT_CONTACT.workingHours}).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
