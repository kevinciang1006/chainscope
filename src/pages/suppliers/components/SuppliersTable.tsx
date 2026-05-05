import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { PaginationState, RowSelectionState, SortingState, Updater } from '@tanstack/react-table';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { RatingBadge } from '@/components/common/RatingBadge';
import { RiskPill } from '@/components/common/RiskPill';
import { EmptyState } from '@/components/common/EmptyState';
import { toast } from '@/hooks/useToast';
import { GRADES, PAGE_SIZE, SKELETON_ROWS } from '@/lib/constants';
import { formatMonthsAgo, formatShortDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { Supplier } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SuppliersTableProps {
  data: Supplier[];
  isLoading: boolean;
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (next: RowSelectionState) => void;
  onRowClick: (id: string) => void;
  onClearFilters?: () => void;
}

// ---------------------------------------------------------------------------
// Risk level numeric weight for sorting
// ---------------------------------------------------------------------------

const RISK_WEIGHTS: Record<string, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: 3,
};

// ---------------------------------------------------------------------------
// E/S/G mini bars cell
// ---------------------------------------------------------------------------

function EsgMiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[0.625rem] font-mono text-text-3 w-3 shrink-0">{label}</span>
      <div className="flex-1 h-1 rounded-full bg-surface-2 overflow-hidden min-w-[40px]">
        <div
          className="h-full rounded-full bg-brand-700 transition-all duration-200"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      <span className="text-[0.625rem] font-mono tabular-nums text-text-2 w-6 text-right shrink-0">
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sort chevron
// ---------------------------------------------------------------------------

function SortChevron({ direction }: { direction: 'asc' | 'desc' | false }) {
  if (direction === 'asc') {
    return <ChevronUp className="h-3.5 w-3.5 ml-1 shrink-0 transition-transform duration-150" aria-hidden="true" />;
  }
  if (direction === 'desc') {
    return <ChevronDown className="h-3.5 w-3.5 ml-1 shrink-0 transition-transform duration-150" aria-hidden="true" />;
  }
  return <ChevronsUpDown className="h-3.5 w-3.5 ml-1 shrink-0 text-text-3 transition-transform duration-150" aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Column helper
// ---------------------------------------------------------------------------

const columnHelper = createColumnHelper<Supplier>();

// ---------------------------------------------------------------------------
// SuppliersTable
// ---------------------------------------------------------------------------

export function SuppliersTable({
  data,
  isLoading,
  rowSelection,
  onRowSelectionChange,
  onRowClick,
  onClearFilters,
}: SuppliersTableProps) {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  // Reset to first page when data changes (new filter applied)
  const dataLength = data.length;
  const prevDataLength = useMemo(() => dataLength, [dataLength]);
  if (prevDataLength !== dataLength && pagination.pageIndex !== 0) {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }

  const columns = useMemo(
    () => [
      // 1. Select
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
            }
            onCheckedChange={(v) =>
              table.toggleAllPageRowsSelected(v === true)
            }
            aria-label="Select all rows on this page"
          />
        ),
        cell: ({ row }) => (
          <span
            onClick={(e) => e.stopPropagation()}
            className="inline-flex"
          >
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(v) => row.toggleSelected(!!v)}
              aria-label={`Select ${row.original.name}`}
            />
          </span>
        ),
        enableSorting: false,
        size: 40,
      }),

      // 2. Supplier
      columnHelper.accessor('name', {
        header: 'Supplier',
        cell: ({ row }) => (
          <div className="min-w-[140px]">
            <div className="font-medium text-text-1 leading-tight">{row.original.name}</div>
            <div className="font-mono text-xs text-text-3 mt-0.5">
              {row.original.country} · {row.original.countryCode}
            </div>
          </div>
        ),
        sortingFn: 'alphanumeric',
        enableSorting: true,
      }),

      // 3. Industry
      columnHelper.accessor('industry', {
        header: 'Industry',
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue()}</Badge>
        ),
        enableSorting: true,
      }),

      // 4. Tier
      columnHelper.accessor('tier', {
        header: 'Tier',
        cell: ({ getValue }) => (
          <Badge variant="outline">{getValue()}</Badge>
        ),
        enableSorting: true,
        sortingFn: (a, b) => {
          const order = ['Tier 1', 'Tier 2', 'Tier 3'];
          return order.indexOf(a.original.tier) - order.indexOf(b.original.tier);
        },
      }),

      // 5. ESG Rating
      columnHelper.accessor('esgRating', {
        header: 'Rating',
        cell: ({ getValue }) => <RatingBadge grade={getValue()} size="md" />,
        enableSorting: true,
        sortingFn: (a, b) =>
          GRADES.indexOf(a.original.esgRating) - GRADES.indexOf(b.original.esgRating),
      }),

      // 6. E / S / G subscores
      columnHelper.display({
        id: 'esg-scores',
        header: 'E / S / G',
        cell: ({ row }) => (
          <div className="space-y-0.5 w-[120px]">
            <EsgMiniBar label="E" value={row.original.scores.e} />
            <EsgMiniBar label="S" value={row.original.scores.s} />
            <EsgMiniBar label="G" value={row.original.scores.g} />
          </div>
        ),
        enableSorting: false,
      }),

      // 7. Risk
      columnHelper.accessor('riskLevel', {
        header: 'Risk',
        cell: ({ getValue }) => <RiskPill level={getValue()} size="sm" />,
        enableSorting: true,
        sortingFn: (a, b) =>
          (RISK_WEIGHTS[a.original.riskLevel] ?? 0) -
          (RISK_WEIGHTS[b.original.riskLevel] ?? 0),
      }),

      // 8. Last Audit
      columnHelper.accessor('lastAuditDate', {
        header: 'Last Audit',
        cell: ({ getValue }) => {
          const iso = getValue();
          return (
            <div className="min-w-[90px]">
              <div className="tabular-nums text-text-1">{formatShortDate(iso)}</div>
              <div className="text-xs text-text-3 tabular-nums mt-0.5">{formatMonthsAgo(iso)}</div>
            </div>
          );
        },
        enableSorting: true,
      }),

      // 9. Actions
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <span onClick={(e) => e.stopPropagation()} className="inline-flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Actions for ${row.original.name}`}
                  className="h-8 w-8"
                >
                  <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onSelect={() => navigate(`/suppliers/${row.original.id}`)}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    toast({
                      title: 'Audit scheduled',
                      description: `${row.original.name} added to audit queue.`,
                      variant: 'success',
                    })
                  }
                >
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  Schedule Audit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    toast({
                      title: 'Export queued',
                      description: `${row.original.name} export will arrive shortly.`,
                      variant: 'info',
                    })
                  }
                >
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    toast({
                      title: 'Flagged for review',
                      description: `${row.original.name} has been flagged.`,
                      variant: 'default',
                    })
                  }
                  className="text-risk-high"
                >
                  Flag for Review
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        ),
        enableSorting: false,
        size: 48,
      }),
    ],
    [navigate],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: (updaterOrValue: Updater<RowSelectionState>) => {
      const next =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(rowSelection)
          : updaterOrValue;
      onRowSelectionChange(next);
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = data.length;
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          {/* Header */}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-border-strong bg-bg"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  const ariaSortValue: 'ascending' | 'descending' | 'none' =
                    sortDir === 'asc'
                      ? 'ascending'
                      : sortDir === 'desc'
                      ? 'descending'
                      : 'none';

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-3 whitespace-nowrap"
                      aria-sort={canSort ? ariaSortValue : undefined}
                      style={{ width: header.column.getSize() }}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            'inline-flex items-center gap-0.5',
                            'hover:text-text-1 transition-colors duration-100',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded-sm',
                            sortDir && 'text-text-1',
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <SortChevron direction={sortDir} />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-4" /></td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-36 mb-1.5" />
                    <Skeleton className="h-3 w-20" />
                  </td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-14" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-7 w-12" /></td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-1 w-24 mb-1.5" />
                    <Skeleton className="h-1 w-20 mb-1.5" />
                    <Skeleton className="h-1 w-16" />
                  </td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-20 mb-1.5" />
                    <Skeleton className="h-3 w-12" />
                  </td>
                  <td className="px-4 py-3"><Skeleton className="h-8 w-8" /></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-0">
                  <EmptyState
                    title="No suppliers match your filters"
                    description="Try adjusting your search terms or removing some filters."
                    action={
                      onClearFilters ? (
                        <Button variant="outline" size="sm" onClick={onClearFilters}>
                          Clear filters
                        </Button>
                      ) : undefined
                    }
                  />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick(row.original.id)}
                  className={cn(
                    'border-b border-border last:border-b-0',
                    'hover:bg-surface-2 hover:shadow-xs',
                    'transition-colors duration-100 cursor-pointer',
                    row.getIsSelected() && 'bg-brand-50/40',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 text-sm text-text-2 border-t border-border">
          <span className="tabular-nums">
            Showing{' '}
            <span className="font-medium text-text-1">{start}</span>–<span className="font-medium text-text-1">{end}</span>{' '}
            of{' '}
            <span className="font-medium text-text-1 tabular-nums">{totalRows}</span>
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
