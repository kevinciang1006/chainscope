import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/useToast';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BulkActionsBarProps {
  count: number;
  onClear: () => void;
}

// ---------------------------------------------------------------------------
// BulkActionsBar — exported
// ---------------------------------------------------------------------------

export function BulkActionsBar({ count, onClear }: BulkActionsBarProps) {
  return (
    <div
      role="region"
      aria-label="Bulk actions"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 animate-slide-up"
    >
      <div className="flex items-center gap-3 rounded-full bg-text-1 text-white px-4 py-2 shadow-md">
        <span className="text-sm font-medium tabular-nums whitespace-nowrap">
          {count} selected
        </span>

        {/* Separator */}
        <span className="h-4 w-px bg-white/20 shrink-0" aria-hidden="true" />

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 hover:text-white focus-visible:ring-white"
          onClick={() => {
            toast({
              title: 'Export queued',
              description: 'CSV will arrive in your inbox shortly.',
              variant: 'success',
            });
            onClear();
          }}
        >
          Export CSV
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 hover:text-white focus-visible:ring-white"
          onClick={() => {
            toast({
              title: 'Audits scheduled',
              description: `${count} supplier${count === 1 ? '' : 's'} added to the audit queue.`,
              variant: 'info',
            });
            onClear();
          }}
        >
          Schedule Audit
        </Button>

        {/* Separator */}
        <span className="h-4 w-px bg-white/20 shrink-0" aria-hidden="true" />

        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white"
          onClick={onClear}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
