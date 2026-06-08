import {
  Archive,
  Bell,
  ClipboardPlus,
  Droplets,
  FileClock,
  FilePenLine,
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

export const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/dashboard", group: "Command", allowedRoles: allRoles, status: "ready" },
  { id: "search", label: "Global Search", icon: Search, route: "/search", group: "Command", allowedRoles: allRoles, status: "ready" },
  { id: "notifications", label: "Notifications", icon: Bell, route: "/notifications", group: "Command", allowedRoles: allRoles, status: "ready" },
  { id: "patient-details", label: "Patient Details", icon: UserRound, route: "/patient-details", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Receptionist", "Billing Executive", "Management"], status: "ready" },
  { id: "patient-history", label: "Patient History", icon: FileClock, route: "/patient-history", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Receptionist", "Billing Executive", "Management"], status: "ready" },
  { id: "patient-list", label: "Patient Details List", icon: UserRound, route: "/patient-list", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Receptionist", "Billing Executive", "Management"], status: "ready" },
  { id: "patient-history-list", label: "Patient History List", icon: ListChecks, route: "/patient-history-list", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Receptionist", "Billing Executive", "Management"], status: "ready" },
  { id: "notes", label: "Notes", icon: FilePenLine, route: "/notes", group: "Patient Management", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Management"], status: "ready" },
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
