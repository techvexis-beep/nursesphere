import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className, size = 20 }: { className?: string; size?: number }) {
  return <Loader2 className={cn('animate-spin', className)} size={size} />;
}

export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <Spinner size={32} className="text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function CardLoader() {
  return (
    <div className="animate-pulse space-y-4 p-6 border rounded-lg">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-muted rounded', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <SkeletonLine className="h-5 w-2/3" />
      <SkeletonLine className="h-4 w-1/3" />
      <div className="space-y-2 pt-2">
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-4/5" />
        <SkeletonLine className="h-3 w-3/5" />
      </div>
    </div>
  );
}

export function InlineLoader() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner size={14} />
      Loading...
    </span>
  );
}
