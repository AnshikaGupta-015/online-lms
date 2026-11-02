import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  QrCode,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Smartphone,
  Info
} from 'lucide-react';
import { Course, Order, formatInr, formatPaise } from '../types';
import { api } from '../lib/api';
import { PLATFORM_INFO } from '../lib/constants';

interface CheckoutModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess
}) => {
  const navigate = useNavigate();

  // Pricing calculations in integer paise (1 INR = 100 paise)
  const basePricePaise = Math.round(Number(course.price) * 100);
  const gstPaise = Math.round(basePricePaise * PLATFORM_INFO.gstRate);
  const totalPaise = basePricePaise + gstPaise;

  const [upiId, setUpiId] = useState('');
  const [selectedApp, setSelectedApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  // Flow states: 'summary' | 'processing' | 'success' | 'failed'
  const [step, setStep] = useState<'summary' | 'processing' | 'success' | 'failed'>('summary');
  const [processingStatus, setProcessingStatus] = useState('Initiating payment request...');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  if (!isOpen) return null;

  const validateUpi = (v: string): boolean => {
    return /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/.test(v.trim());
  };

  const handleSelectApp = (app: 'gpay' | 'phonepe' | 'paytm' | 'bhim') => {
    setSelectedApp(app);
    const handles = {
      gpay: 'student@okaxis',
      phonepe: 'student@ybl',
      paytm: 'student@paytm',
      bhim: 'student@upi'
    };
    setUpiId(handles[app]);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUpi(upiId)) {
      setErrorMessage('Please enter a valid UPI ID (e.g. yourname@okhdfcbank or user@upi)');
      return;
    }

    setErrorMessage('');
    setStep('processing');
    setProcessingStatus('Connecting to National Payments Corporation of India (NPCI)...');

    try {
      // 1. Create order on server (re-verifies price from DB)
      setIsCreatingOrder(true);
      const createdOrder = await api.createPaymentOrder(course.id);
      setOrder(createdOrder);

      // 2. Simulated 2.5 second banking processing delay
      await new Promise(r => setTimeout(r, 1200));
      setProcessingStatus('Verifying Virtual Payment Address (VPA)...');
      await new Promise(r => setTimeout(r, 1300));

      // 3. Complete payment on server
      const paymentResult = await api.payOrder(createdOrder.id, upiId);
      setOrder(paymentResult.order);
      setStep('success');
      onSuccess(paymentResult.order);
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'Payment processing was declined by the bank.');
      setStep('failed');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleRetry = () => {
    setStep('summary');
    setErrorMessage('');
  };

  const handleStartLearning = () => {
    onClose();
    navigate(`/learn/${course.slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0056D2] text-white flex items-center justify-center font-bold text-sm">
              ₹
            </div>
            <div>
              <h2 id="checkout-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                LearnHub Fast UPI Checkout
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-600" />
                256-Bit SSL Encrypted &bull; 100% Secure Transaction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={step === 'processing'}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Notice Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/50 px-6 py-2.5 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demo UPI Simulation:</strong> No real money will be charged to your bank account. Use any dummy UPI ID (e.g.{' '}
            <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/60 rounded font-mono font-medium">name@upi</code>)
            or test failure with{' '}
            <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/60 rounded font-mono font-medium">test.fail@upi</code>.
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 'summary' && (
            <div className="space-y-6">
              {/* Course Order Summary */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-20 h-16 rounded-md object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0056D2] dark:text-blue-400">
                    Course Enrollment
                  </span>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Full lifetime access &bull; Certificate of completion
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {formatInr(course.price)}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Course Base Price</span>
                  <span>{formatPaise(basePricePaise)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    Applicable GST (18%)
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                      Standard
                    </span>
                  </span>
                  <span>{formatPaise(gstPaise)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-base text-slate-900 dark:text-white">
                  <span>Total Amount Payable</span>
                  <span className="text-[#0056D2] dark:text-blue-400 text-lg">
                    {formatPaise(totalPaise)}
                  </span>
                </div>
              </div>

              {/* UPI Options */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select UPI Application or Enter Virtual Address
                </label>

                {/* Fast app buttons */}
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { id: 'gpay', label: 'Google Pay', color: 'hover:border-blue-500' },
                    { id: 'phonepe', label: 'PhonePe', color: 'hover:border-purple-500' },
                    { id: 'paytm', label: 'Paytm', color: 'hover:border-sky-500' },
                    { id: 'bhim', label: 'BHIM UPI', color: 'hover:border-emerald-500' }
                  ].map(app => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleSelectApp(app.id as any)}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all ${
                        selectedApp === app.id
                          ? 'border-[#0056D2] bg-blue-50/50 dark:bg-blue-950/40 text-[#0056D2] dark:text-blue-400 ring-2 ring-[#0056D2]/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-slate-500" />
                      <span>{app.label}</span>
                    </button>
                  ))}
                </div>

                {/* UPI Form */}
                <form onSubmit={handlePay} className="space-y-4">
                  <div>
                    <label
                      htmlFor="upi-id-input"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Enter your UPI ID / VPA
                    </label>
                    <div className="relative">
                      <input
                        id="upi-id-input"
                        type="text"
                        value={upiId}
                        onChange={e => {
                          setUpiId(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="e.g. username@okhdfcbank or student@upi"
                        className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-transparent text-slate-900 dark:text-white"
                        autoFocus
                      />
                      {validateUpi(upiId) && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />
                      )}
                    </div>
                    {errorMessage && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Visual QR Code preview */}
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 p-1 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <QrCode className="w-9 h-9 text-slate-800 dark:text-slate-200" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          Scan to Pay via Any UPI App
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Supports GPay, PhonePe, Paytm, CRED, Amazon Pay
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-[#0056D2] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded">
                      Fast UPI 2.0
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!upiId.trim() || isCreatingOrder}
                      className="w-full py-3 px-4 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span>Pay {formatPaise(totalPaise)} via UPI</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2">
                      By proceeding, you agree to LearnHub Terms of Service. Instant course access upon payment.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-[#0056D2] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-[#0056D2]" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Processing UPI Payment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {processingStatus}
                </p>
              </div>
              <div className="w-48 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#0056D2] h-full w-2/3 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">
                Please do not refresh or close this window.
              </p>
            </div>
          )}

          {step === 'success' && order && (
            <div className="py-6 flex flex-col items-center text-center space-y-5 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Payment Successful!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You are now enrolled in <strong>{order.courseTitle}</strong>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="w-full p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Number:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID (UPI Ref):</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    {order.transactionId || 'UPI-REF-CONFIRMED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Paid Amount:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatPaise(order.totalAmountPaise)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-medium text-slate-900 dark:text-white uppercase">
                    UPI ({order.maskedUpiId || upiId})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="text-slate-900 dark:text-white">
                    {new Date(order.paidAt || Date.now()).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata'
                    })}
                  </span>
                </div>
              </div>

              <div className="w-full flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/receipts')}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  View Receipts
                </button>
                <button
                  type="button"
                  onClick={handleStartLearning}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'failed' && (
            <div className="py-6 flex flex-col items-center text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Payment Failed
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 max-w-sm">
                  {errorMessage || 'The bank declined this transaction. Please verify your VPA and try again.'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-left text-xs text-slate-500 space-y-1 w-full max-w-sm">
                <p>&bull; Ensure your UPI handle ends with valid bank identifier (e.g. @okhdfcbank, @ybl, @upi).</p>
                <p>&bull; If testing simulated failure, remove the word "fail" from your UPI ID.</p>
              </div>
              <div className="flex gap-3 w-full max-w-sm pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Payment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
