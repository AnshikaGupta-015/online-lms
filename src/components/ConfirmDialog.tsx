import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
  requireConfirmationText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  requireConfirmationText,
  onConfirm,
  onCancel
}) => {
  const [typedText, setTypedText] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setTypedText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmed = !requireConfirmationText || typedText.trim() === requireConfirmationText.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {confirmVariant === 'danger' && (
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {message}
              </p>

              {requireConfirmationText && (
                <div className="mt-3 pt-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Type <strong className="text-rose-600 dark:text-rose-400 font-mono">{requireConfirmationText}</strong> to confirm:
                  </label>
                  <input
                    type="text"
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    placeholder={`Type "${requireConfirmationText}"...`}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={!isConfirmed}
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              confirmVariant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
