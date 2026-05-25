"use client";

import * as React from "react";

import { useUiPreference } from "@/components/providers/ui-preference-provider";
import { AppFooter } from "@/components/shell/app-footer";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { TopHeader } from "@/components/shell/top-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { preference, setPreference } = useUiPreference();
  const [collapsed, setCollapsed] = React.useState(false);
  const sidebarCollapsed = preference.sidebar === "collapsed" || (preference.sidebar === "auto" && collapsed);
  const handleCollapsedChange = React.useCallback(
    (nextCollapsed: boolean) => {
      if (preference.sidebar === "auto") {
        setCollapsed(nextCollapsed);
        return;
      }
      setPreference({ ...preference, sidebar: nextCollapsed ? "collapsed" : "expanded" });
    },
    [preference, setPreference],
  );

  return (
    <div className="min-h-dvh max-w-full bg-background text-foreground">
      <div className="flex min-h-dvh min-w-0 max-w-full">
        <AppSidebar collapsed={sidebarCollapsed} onCollapsedChange={handleCollapsedChange} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader />
          <main className="min-w-0 max-w-full flex-1 px-4 pb-8 md:px-6">{children}</main>
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
