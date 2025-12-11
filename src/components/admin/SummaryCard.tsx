import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'accent';
  className?: string;
}

export function SummaryCard({ title, value, subtitle, icon, variant = 'default', className }: SummaryCardProps) {
  const variantStyles = {
    default: 'from-primary/20 to-primary/5 border-primary/20',
    success: 'from-success/20 to-success/5 border-success/20',
    warning: 'from-accent/20 to-accent/5 border-accent/20',
    accent: 'from-accent/20 to-accent/5 border-accent/20',
  };

  const iconStyles = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-accent',
    accent: 'text-accent',
  };

  return (
    <div 
      className={cn(
        'glass rounded-xl p-6 bg-gradient-to-br border animate-fade-in',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-light text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-light text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg bg-background/50', iconStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
