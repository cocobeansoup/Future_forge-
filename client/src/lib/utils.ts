import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return '$0';
  
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  } else {
    return `$${value.toFixed(0)}`;
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(d);
}

export function getStageColor(stage: string): string {
  const stageColors: Record<string, string> = {
    'Qualification': 'blue',
    'Proposal': 'indigo',
    'Negotiation': 'purple',
    'Closing': 'green'
  };
  
  return stageColors[stage] || 'gray';
}

export function getBadgeVariant(stage: string): "default" | "outline" | "secondary" | "destructive" | null {
  switch (stage) {
    case 'Qualification':
      return 'secondary';
    case 'Proposal':
      return 'default';
    case 'Negotiation':
      return 'outline';
    case 'Closing':
      return 'destructive';
    default:
      return null;
  }
}

export function getChangeIndicator(value: number): {
  color: string;
  icon: string;
} {
  if (value > 0) {
    return {
      color: 'text-green-500',
      icon: 'arrow_upward'
    };
  } else if (value < 0) {
    return {
      color: 'text-red-500',
      icon: 'arrow_downward'
    };
  } else {
    return {
      color: 'text-slate-500',
      icon: 'remove'
    };
  }
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}
