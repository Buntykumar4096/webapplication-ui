"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Cross } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/components/providers/role-provider";
import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/utils";
import type { NavigationChildItem, NavigationItem } from "@/types";

export function AppSidebar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { role } = useRole();
  const visibleItems = navigationItems.filter((item) => item.allowedRoles.includes(role));
  const groups = Array.from(new Set(visibleItems.map((item) => item.group)));
  const currentRoute = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;

  return (
    <aside
      className={cn(
        "hidden h-dvh shrink-0 border-r border-border bg-sidebar text-sidebar-foreground transition-all lg:sticky lg:top-0 lg:z-50 lg:flex lg:flex-col",
        collapsed ? "w-[72px]" : "w-[264px]",
      )}
    >
      <div className="flex h-14 items-center gap-3 border-b border-border px-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Cross className="h-5 w-5" />
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Plasmit Hospital</div>
            <div className="text-xs text-sidebar-foreground/65">Enterprise HMS</div>
          </div>
        ) : null}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {groups.map((group) => (
          <div className="mb-3" key={group}>
            {!collapsed ? <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/55">{group}</div> : null}
            <div className="space-y-1">
              {visibleItems
                .filter((item) => item.group === group)
                .map((item) => (
                  <SidebarNavigationItem
                    collapsed={collapsed}
                    currentRoute={currentRoute}
                    item={item}
                    key={`${item.id}:${currentRoute}`}
                    pathname={pathname}
                  />
                ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <Button
          className={cn("w-full", collapsed && "px-0")}
          onClick={() => onCollapsedChange(!collapsed)}
          variant="ghost"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed ? "Collapse" : null}
        </Button>
      </div>
    </aside>
  );
}

function SidebarNavigationItem({
  collapsed,
  currentRoute,
  item,
  pathname,
}: {
  collapsed: boolean;
  currentRoute: string;
  item: NavigationItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const active = item.children?.length
    ? isNavigationTreeActive(item, currentRoute)
    : pathname === item.route || (item.route !== "/dashboard" && pathname.startsWith(`${item.route}/`));
  const [open, setOpen] = React.useState(active);

  if (collapsed || !item.children?.length) {
    return (
      <Link
        aria-label={collapsed ? item.label : undefined}
        className={cn(
          "group flex h-9 items-center gap-3 rounded-md px-2 text-sm font-medium outline-none transition hover:bg-sidebar-active/10 focus-visible:ring-2 focus-visible:ring-ring",
          active && "bg-sidebar-active text-sidebar-active-foreground hover:bg-sidebar-active",
          collapsed && "justify-center",
        )}
        href={item.route}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
        {!collapsed && item.status === "planned" ? <Badge tone="muted">Plan</Badge> : null}
      </Link>
    );
  }

  return (
    <div>
      <button
        aria-expanded={open}
        className={cn(
          "flex h-9 w-full items-center gap-3 rounded-md px-2 text-sm font-medium outline-none transition hover:bg-sidebar-active/10 focus-visible:ring-2 focus-visible:ring-ring",
          active && "bg-sidebar-active/15 text-sidebar-active-foreground",
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-foreground/15 pl-2">
          {item.children.map((child) => (
            <SidebarChildItem currentRoute={currentRoute} item={child} key={`${child.id}:${currentRoute}`} pathname={pathname} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SidebarChildItem({
  currentRoute,
  item,
  pathname,
}: {
  currentRoute: string;
  item: NavigationChildItem;
  pathname: string;
}) {
  const active = isNavigationTreeActive(item, currentRoute);
  const [open, setOpen] = React.useState(active);

  if (item.children?.length) {
    return (
      <div>
        <div
          className={cn(
            "flex min-h-8 w-full items-center gap-2 rounded-md px-2 py-1 text-xs font-medium outline-none transition hover:bg-sidebar-active/10 focus-visible:ring-2 focus-visible:ring-ring",
            active && "text-sidebar-active-foreground",
          )}
        >
          <Link className="min-w-0 flex-1 truncate" href={item.route}>
            {item.label}
          </Link>
          <button
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${item.label}`}
            className="rounded p-1 outline-none hover:bg-sidebar-active/15 focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setOpen((current) => !current)}
            type="button"
          >
            <ChevronDown className={cn("h-3 w-3 shrink-0 transition-transform", open && "rotate-180")} />
          </button>
        </div>
        {open ? (
          <div className="ml-2 space-y-0.5 border-l border-sidebar-foreground/15 pl-2">
            {item.children.map((child) => (
              <SidebarChildItem currentRoute={currentRoute} item={child} key={`${child.id}:${currentRoute}`} pathname={pathname} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const exactActive = isNavigationRouteActive(item.route, currentRoute);
  return (
    <Link
      className={cn(
        "flex min-h-8 items-center rounded-md px-2 py-1 text-xs outline-none transition hover:bg-sidebar-active/10 focus-visible:ring-2 focus-visible:ring-ring",
        exactActive && "bg-sidebar-active text-sidebar-active-foreground",
      )}
      href={item.route}
    >
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function isNavigationRouteActive(route: string, currentRoute: string) {
  return currentRoute === route;
}

function isNavigationTreeActive(item: NavigationChildItem | NavigationItem, currentRoute: string): boolean {
  return isNavigationRouteActive(item.route, currentRoute) || Boolean(item.children?.some((child) => isNavigationTreeActive(child, currentRoute)));
}
