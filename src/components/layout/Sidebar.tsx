import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FileBarChart,
  ClipboardCheck,
  Settings,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const ChainLeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <rect x="4" y="14" width="11" height="6" rx="3" />
    <path d="M21 6c4 0 7 3 7 7s-3 7-7 7" />
    <path d="M28 13c-3 0-6 2-7 5" />
    <line x1="14" y1="17" x2="22" y2="13" />
  </svg>
);

const enabledNavItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Suppliers', to: '/suppliers', icon: Building2, end: false },
];

const disabledNavItems = [
  { label: 'Reports', icon: FileBarChart },
  { label: 'Audits', icon: ClipboardCheck },
  { label: 'Settings', icon: Settings },
];

const activeLinkClass =
  'bg-brand-50 text-brand-800 border-l-2 border-brand-700 pl-[calc(theme(spacing.4)-2px)]';
const inactiveLinkClass =
  'text-text-2 hover:bg-surface-2 border-l-2 border-transparent pl-[calc(theme(spacing.4)-2px)]';

function SidebarContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo / Wordmark */}
      <div className="flex items-center gap-2.5 px-4 py-5 text-brand-700">
        <ChainLeafIcon />
        <span className="font-semibold tracking-tight text-text-1">ChainScope</span>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2" aria-label="Main navigation">
        {enabledNavItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md py-2 pr-4 text-sm font-medium transition-colors duration-150',
                isActive ? activeLinkClass : inactiveLinkClass,
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}

        {disabledNavItems.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-text-3 cursor-not-allowed"
            aria-disabled="true"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{label}</span>
            <Badge variant="muted">Soon</Badge>
          </div>
        ))}
      </nav>

      {/* Bottom slot */}
      <div className="px-2 pb-4">
        <div className="border-t border-border mb-2" />
        <NavLink
          to="/design-system"
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md py-2 pr-4 text-sm font-medium transition-colors duration-150',
              isActive ? activeLinkClass : inactiveLinkClass,
            )
          }
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          Design System
        </NavLink>
      </div>
    </div>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-text-1/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-60 bg-surface border-r border-border transition-transform duration-200 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Sidebar"
      >
        <SidebarContent onClose={onClose} />
      </aside>

      {/* Desktop static sidebar */}
      <aside
        className="hidden lg:flex w-60 shrink-0 flex-col bg-surface border-r border-border"
        aria-label="Sidebar"
      >
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}
