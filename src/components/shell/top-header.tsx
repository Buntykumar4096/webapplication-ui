"use client";

import { Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { CommandSearch } from "@/components/shell/command-search";
import { MobileNavigation } from "@/components/shell/mobile-navigation";
import { NotificationPopover } from "@/components/shell/notification-popover";
import { RoleSwitcher } from "@/components/shell/role-switcher";
import { Button } from "@/components/ui/button";
import { hospitalContext } from "@/data/mock";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-header-border bg-header/92 px-3 backdrop-blur md:px-4">
      <MobileNavigation />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{hospitalContext.name}</span>
          <span className="hidden text-muted-foreground sm:inline">/ {hospitalContext.branch}</span>
        </div>
        <div className="hidden text-xs text-muted-foreground md:block">{hospitalContext.department} • {hospitalContext.shift}</div>
      </div>
      <CommandSearch />
      <RoleSwitcher className="hidden sm:flex" />
      <NotificationPopover />
      <Button asChild size="icon" variant="outline" aria-label="Open UI settings">
        <Link href="/settings/ui">
          <ShieldCheck className="h-4 w-4" />
        </Link>
      </Button>
    </header>
  );
}
