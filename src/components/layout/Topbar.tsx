import { Menu, Building2, ChevronDown, Search, Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopbarProps {
  onMobileNavOpen: () => void;
}

export function Topbar({ onMobileNavOpen }: TopbarProps) {
  return (
    <header className="h-14 bg-surface border-b border-border px-6 flex items-center justify-between shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          className="lg:hidden"
          onClick={onMobileNavOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Workspace switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4 text-text-3" />
              Acme Corporation
              <ChevronDown className="h-3.5 w-3.5 text-text-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Building2 className="h-4 w-4 text-text-3" />
              Acme Corporation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Add workspace…</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-risk-high" />
        </Button>

        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-800 font-medium text-xs flex items-center justify-center ml-1 select-none">
          KC
        </div>
      </div>
    </header>
  );
}
