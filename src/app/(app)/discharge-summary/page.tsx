import { Suspense } from "react";

import { NotesPage } from "@/features/notes/notes-page";

export default function DischargeSummaryRoute() {
  return (
    <Suspense fallback={<div className="py-6 text-sm text-muted-foreground">Loading discharge summary...</div>}>
      <NotesPage standaloneCategory="Discharge Summary" />
    </Suspense>
  );
}
