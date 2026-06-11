import {
  Archive,
  Bell,
  ClipboardPlus,
  Droplets,
  FileClock,
  FilePenLine,
  FileText,
  LayoutDashboard,
  ListChecks,
  ScanSearch,
  Search,
  Settings,
  UserRound,
} from "lucide-react";

import type { NavigationItem, Role } from "@/types";

export const roles: Role[] = [
  "Super Admin",
  "Hospital Admin",
  "Doctor",
  "Nurse",
  "Receptionist",
  "Lab Technician",
  "Radiologist",
  "Pharmacist",
  "Billing Executive",
  "HR Manager",
  "Management",
];

const allRoles = roles;

function notesRoute(category?: string, specialty?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (specialty) params.set("specialty", specialty);
  const query = params.toString();
  return query ? `/notes?${query}` : "/notes";
}

function noteCategoryMenu(id: string, label: string, specialties: string[]) {
  return {
    id: `notes-${id}`,
    label,
    route: notesRoute(id),
    children: specialties.length
      ? [
          { id: `notes-${id}-all`, label: `All ${label}`, route: notesRoute(id) },
          ...specialties.map((specialty) => ({
            id: `notes-${id}-${specialty.toLowerCase().replaceAll(" ", "-")}`,
            label: specialty,
            route: notesRoute(id, specialty),
          })),
        ]
      : undefined,
  };
}

const notesMenu = [
  { id: "notes-all", label: "All Notes", route: "/notes" },
  noteCategoryMenu("nurse", "Nurse Notes", ["ICU Nurse", "Ward Nurse", "ED Nurse"]),
  noteCategoryMenu("medical", "Medical (ED Notes)", ["Palliative Medicine", "Cardiothoracic", "Neurology", "Respiratory Medicine", "Cardiology", "Hepatology", "Infectious Diseases", "Dermatology", "Ophthalmology", "Palliative Care", "Rehabilitation", "Geriatrics", "Radiology"]),
  noteCategoryMenu("surgery", "Surgery Notes", ["Neurosurgery", "Ophthalmology", "ENT", "Cardiothoracic Surgery", "Thoracic Surgery", "Hepatobiliary Surgery", "General Surgery", "Colorectal Surgery", "Upper GI Surgery", "Lower GI Surgery", "Vascular Surgery", "Orthopedic Surgery", "Interventional Radiology"]),
  noteCategoryMenu("pharmacy", "Pharmacy Notes", []),
  noteCategoryMenu("allied", "Allied Health Notes", ["Physiotherapy", "Dietitian", "Social Work", "Occupational Therapy", "Speech Therapy", "Psychology"]),
  noteCategoryMenu("additional", "Additional Progress Notes", ["General", "Follow Up", "Phone Call Note", "Family Meeting", "Handover", "Case Management", "Morning Round", "Evening Round", "Consultant Notes"]),
  { id: "notes-filter", label: "Filter Notes", route: "/notes?filters=open" },
];

export const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/dashboard", group: "Command", allowedRoles: allRoles, status: "ready" },
  { id: "search", label: "Global Search", icon: Search, route: "/search", group: "Command", allowedRoles: allRoles, status: "ready" },
  { id: "notifications", label: "Notifications", icon: Bell, route: "/notifications", group: "Command", allowedRoles: allRoles, status: "ready" },
  { id: "patient-details", label: "Patient Details", icon: UserRound, route: "/patient-details", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Receptionist", "Billing Executive", "Management"], status: "ready" },
  { id: "patient-history", label: "Patient History", icon: FileClock, route: "/patient-history", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Receptionist", "Billing Executive", "Management"], status: "ready" },
  { id: "patient-list", label: "Patient Details List", icon: UserRound, route: "/patient-list", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Receptionist", "Billing Executive", "Management"], status: "ready" },
  { id: "patient-history-list", label: "Patient History List", icon: ListChecks, route: "/patient-history-list", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Receptionist", "Billing Executive", "Management"], status: "ready" },
  { id: "notes", label: "Notes", icon: FilePenLine, route: "/notes", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Management"], status: "ready", children: notesMenu },
  { id: "discharge-summary", label: "Discharge Summary", icon: FileText, route: "/discharge-summary", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Management"], status: "ready" },
  { id: "radiology", label: "Radiology", icon: ScanSearch, route: "/radiology", group: "Radiology", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Receptionist", "Radiologist", "Billing Executive", "Management"], status: "ready" },
  { id: "intake-output", label: "Intake-Output", icon: Droplets, route: "/intake-output", group: "IPD Nursing", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Management"], status: "ready" },
  // POCT entries are appended here so the existing sidebar rendering remains unchanged.
  { id: "poct-add", label: "Add POCT", icon: ClipboardPlus, route: "/poct/add", group: "POCT", allowedRoles: allRoles, status: "ready" },
  { id: "poct-results", label: "View POCT Result", icon: FileClock, route: "/poct/results", group: "POCT", allowedRoles: allRoles, status: "ready" },
  { id: "settings", label: "UI Settings", icon: Settings, route: "/settings/ui", group: "Command", allowedRoles: allRoles, status: "ready" },
  { id: "preview", label: "Components Preview", icon: Archive, route: "/components-preview", group: "Command", allowedRoles: ["Super Admin", "Hospital Admin"], status: "ready" },
];

export const dashboardQuickActions = [
  { id: "radiology", label: "Open radiology", icon: ScanSearch, route: "/radiology" },
  { id: "radiology-orders", label: "Radiology orders", icon: ScanSearch, route: "/radiology/orders" },
  { id: "radiology-reports", label: "Radiology reports", icon: ScanSearch, route: "/radiology/reports" },
  { id: "radiology-schedule", label: "Radiology schedule", icon: ScanSearch, route: "/radiology/schedule" },
];
