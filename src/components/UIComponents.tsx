import React from 'react';

// ==========================================
// COURSERA-STYLE BUTTON COMPONENT
// ==========================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0056D2]/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-md';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2.5'
  }[size];

  const variantClasses = {
    primary:
      'bg-[#0056D2] hover:bg-[#00419e] text-white shadow-xs dark:bg-blue-600 dark:hover:bg-blue-700',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100',
    outline:
      'border border-slate-300 dark:border-slate-700 hover:border-[#0056D2] hover:text-[#0056D2] text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900',
    ghost:
      'hover:bg-slate-100 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-300',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// ==========================================
// COURSERA-STYLE BADGE COMPONENT (NO PILL/OVAL, CLEAN 4px RADIUS)
// ==========================================
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = ''
}) => {
  const variantClasses = {
    primary: 'bg-blue-50 text-[#0056D2] border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/50',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/50',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/50',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900/50',
    outline: 'bg-transparent text-slate-600 border border-slate-300 dark:text-slate-400 dark:border-slate-700'
  }[variant];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

// ==========================================
// COURSERA/UDEMY CARD COMPONENT (1px BORDER, CLEAN RADIUS)
// ==========================================
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 ${
        hoverable ? 'hover:border-slate-300 dark:hover:border-slate-700 transition-colors' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ==========================================
// TABS COMPONENT (CLEAN UNDERLINE STYLE)
// ==========================================
export interface TabItem {
  id: string;
  label: React.ReactNode;
  badge?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto ${className}`}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-1.5 whitespace-nowrap ${
              isActive
                ? 'text-[#0056D2] dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && <span>{tab.badge}</span>}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0056D2] dark:bg-blue-400" />
            )}
          </button>
        );
      })}
    </div>
  );
};
