"use client";

import * as React from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileBadge,
  FileSearch,
  HeartPulse,
  IdCard,
  RotateCcw,
  Save,
  Search,
  Send,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const fieldClass = "space-y-1.5";
const labelClass = "text-xs font-medium text-foreground";
const radioLabelClass = "inline-flex min-h-7 items-center gap-2 rounded-md px-1 text-xs text-foreground";
const radioInputClass =
  "h-4 w-4 shrink-0 appearance-none rounded-full border-2 border-muted-foreground bg-background shadow-sm transition checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-ring/20";
const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];
const patientDetailTabs = [
  { id: "basic", label: "1. Basic Demographics" },
  { id: "clinical", label: "2. Physical & Clinical" },
  { id: "admission", label: "3. Admission" },
  { id: "referral", label: "4. Referral" },
  { id: "diagnosis", label: "5. Diagnosis" },
  { id: "additional", label: "6. Additional Clinical" },
  { id: "admin", label: "7. Administrative" },
] as const;

type PatientDetailTab = (typeof patientDetailTabs)[number]["id"];

function calculateAge(dateOfBirth: string) {
  if (!dateOfBirth) return "";
  const birthDate = parseDateValue(dateOfBirth);
  if (!birthDate) return "";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age >= 0 ? String(age) : "";
}

function parseDateValue(value: string) {
  const [day, month, year] = value.split("/");
  if (!day || !month || !year || year.length !== 4) return null;
  const parsedDay = Number(day);
  const parsedMonth = Number(month);
  const parsedYear = Number(year);
  const date = new Date(parsedYear, parsedMonth - 1, parsedDay);
  const isValid =
    date.getFullYear() === parsedYear &&
    date.getMonth() === parsedMonth - 1 &&
    date.getDate() === parsedDay;
  return isValid ? date : null;
}

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join("/");
}

function dateTextToNative(value: string) {
  const [day, month, year] = value.split("/");
  if (!day || !month || !year || year.length !== 4) return "";
  if (!parseDateValue(value)) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function nativeDateToText(value: string) {
  const [year, month, day] = value.split("-");
  if (!day || !month || !year) return "";
  return `${day}/${month}/${year}`;
}

function textDateToParts(value: string) {
  const parsedDate = parseDateValue(value);
  const fallbackDate = new Date();
  const date = parsedDate ?? fallbackDate;
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  };
}

function datePartsToText(day: number, month: number, year: number) {
  return `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;
}

function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function calculateBmi(height: string, weight: string) {
  const heightCm = Number(height);
  const weightKg = Number(weight);
  if (!heightCm || !weightKg) return "";
  const heightMeters = heightCm / 100;
  return (weightKg / (heightMeters * heightMeters)).toFixed(1);
}

function validateNumericInput(event: React.FormEvent<HTMLInputElement>, label: string, allowDecimal = false) {
  const input = event.currentTarget;
  const value = input.value.trim();
  const numberPattern = allowDecimal ? /^\d*(\.\d*)?$/ : /^\d*$/;
  input.setCustomValidity(value && !numberPattern.test(value) ? `${label} must contain numbers only.` : "");
}

function preventInvalidNumericInput(event: React.FormEvent<HTMLInputElement>, allowDecimal = false) {
  const nativeEvent = event.nativeEvent as InputEvent;
  const input = event.currentTarget;
  const data = nativeEvent.data ?? "";
  if (!data) return;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const nextValue = `${input.value.slice(0, start)}${data}${input.value.slice(end)}`;
  const numberPattern = allowDecimal ? /^\d*(\.\d*)?$/ : /^\d*$/;
  if (!numberPattern.test(nextValue)) {
    event.preventDefault();
  }
}

function preventInvalidNumericPaste(event: React.ClipboardEvent<HTMLInputElement>, allowDecimal = false) {
  const input = event.currentTarget;
  const paste = event.clipboardData.getData("text");
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const nextValue = `${input.value.slice(0, start)}${paste}${input.value.slice(end)}`;
  const numberPattern = allowDecimal ? /^\d*(\.\d*)?$/ : /^\d*$/;
  if (!numberPattern.test(nextValue)) {
    event.preventDefault();
  }
}

function DateTextInput({
  value,
  onChange,
  required,
}: {
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  const [internalValue, setInternalValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [visibleMonth, setVisibleMonth] = React.useState(() => textDateToParts(value ?? "").month);
  const [visibleYear, setVisibleYear] = React.useState(() => textDateToParts(value ?? "").year);
  const [popoverStyle, setPopoverStyle] = React.useState<React.CSSProperties>({});
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const currentValue = value ?? internalValue;
  const selected = parseDateValue(currentValue);
  const monthNames = React.useMemo(() => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], []);
  const yearOptions = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1900 + 6 }, (_, index) => currentYear + 5 - index);
  }, []);
  const totalDays = daysInMonth(visibleMonth, visibleYear);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = formatDateInput(event.target.value);
    setInternalValue(nextValue);
    onChange?.(nextValue);
    const nextDate = parseDateValue(nextValue);
    if (nextDate) {
      setVisibleMonth(nextDate.getMonth());
      setVisibleYear(nextDate.getFullYear());
    }
  }

  function updatePopoverPosition() {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(352, window.innerWidth - 32);
    const left = Math.min(Math.max(rect.left, 16), window.innerWidth - width - 16);
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow >= 360 ? rect.bottom + 8 : Math.max(16, rect.top - 360);
    setPopoverStyle({ left, top, width });
  }

  function toggleCalendar() {
    updatePopoverPosition();
    setOpen((current) => !current);
  }

  function selectDate(day: number) {
    const nextValue = datePartsToText(day, visibleMonth, visibleYear);
    setInternalValue(nextValue);
    onChange?.(nextValue);
    setOpen(false);
  }

  function moveMonth(direction: -1 | 1) {
    const nextDate = new Date(visibleYear, visibleMonth + direction, 1);
    setVisibleMonth(nextDate.getMonth());
    setVisibleYear(nextDate.getFullYear());
  }

  React.useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleViewportChange() {
      if (open) updatePopoverPosition();
    }

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open]);

  React.useEffect(() => {
    const nextDate = parseDateValue(currentValue);
    if (nextDate) {
      setVisibleMonth(nextDate.getMonth());
      setVisibleYear(nextDate.getFullYear());
    }
  }, [currentValue]);

  function handleYearChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextYear = Number(event.target.value);
    if (nextYear >= 1900 && nextYear <= 2100) {
      setVisibleYear(nextYear);
    }
  }

  function selectToday() {
    const today = new Date();
    const nextValue = datePartsToText(today.getDate(), today.getMonth(), today.getFullYear());
    setVisibleMonth(today.getMonth());
    setVisibleYear(today.getFullYear());
    setInternalValue(nextValue);
    onChange?.(nextValue);
    setOpen(false);
  }

  function clearDate() {
    setInternalValue("");
    onChange?.("");
    setOpen(false);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <Input
          aria-label="Select date"
          inputMode="numeric"
          maxLength={10}
          onBeforeInput={(event) => preventInvalidNumericInput(event)}
          onChange={handleChange}
          onFocus={() => {
            updatePopoverPosition();
            setOpen(true);
          }}
          onPaste={(event) => preventInvalidNumericPaste(event)}
          placeholder="DD / MM / YYYY"
          required={required}
          value={currentValue}
        />
        <button
          aria-label="Open date selector"
          className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground"
          onClick={toggleCalendar}
          type="button"
        >
          <CalendarDays className="h-4 w-4" />
        </button>
      </div>

      {open ? (
        <div className="fixed z-[100] rounded-lg border border-border bg-surface p-3 shadow-soft" style={popoverStyle}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <Button aria-label="Previous month" onClick={() => moveMonth(-1)} size="icon" type="button" variant="ghost">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="grid flex-1 grid-cols-[1fr_6rem] gap-2">
              <select
                aria-label="Select month"
                className={selectClass}
                onChange={(event) => setVisibleMonth(Number(event.target.value))}
                value={visibleMonth}
              >
                {monthNames.map((monthName, index) => (
                  <option key={monthName} value={index}>
                    {monthName}
                  </option>
                ))}
              </select>
              <select
                aria-label="Select year"
                className={selectClass}
                onChange={handleYearChange}
                value={visibleYear}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <Button aria-label="Next month" onClick={() => moveMonth(1)} size="icon" type="button" variant="ghost">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
              <span key={dayName}>{dayName}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: new Date(visibleYear, visibleMonth, 1).getDay() }).map((_, index) => (
              <span key={`blank-${index}`} />
            ))}
            {Array.from({ length: totalDays }).map((_, index) => {
              const day = index + 1;
              const active =
                selected?.getDate() === day &&
                selected.getMonth() === visibleMonth &&
                selected.getFullYear() === visibleYear;
              return (
                <button
                  className={`h-8 rounded-md text-xs font-medium transition ${
                    active ? "bg-primary text-primary-foreground" : "hover:bg-surface-muted"
                  }`}
                  key={day}
                  onClick={() => selectDate(day)}
                  type="button"
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <Button onClick={clearDate} size="sm" type="button" variant="ghost">
              Clear
            </Button>
            <Button onClick={selectToday} size="sm" type="button" variant="outline">
              Today
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SignatureUpload({ label }: { label: string }) {
  const [fileName, setFileName] = React.useState("");

  return (
    <div className="space-y-1.5">
      <span className={labelClass}>{label}</span>
      <label className="flex h-9 cursor-pointer items-center justify-between gap-3 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground shadow-sm transition hover:bg-surface-muted">
        <span className="min-w-0 truncate">{fileName || "Upload signature"}</span>
        <Upload className="h-4 w-4 shrink-0 text-primary" />
        <input
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="sr-only"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
          type="file"
        />
      </label>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`${fieldClass} ${className ?? ""}`}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function RadioOption({ label, name }: { label: string; name: string }) {
  return (
    <label className={radioLabelClass}>
      <input className={radioInputClass} name={name} type="radio" />
      <span className="leading-5">{label}</span>
    </label>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof UserRound;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-visible">
      <CardHeader className="bg-surface-muted/60">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex">
      <Input className="rounded-r-none" placeholder={placeholder} />
      <Button aria-label="Search" className="rounded-l-none border-l-0" size="icon" type="button" variant="outline">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function PatientDetailsPage() {
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [activeTab, setActiveTab] = React.useState<PatientDetailTab>("basic");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [age, setAge] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [clinicalHeight, setClinicalHeight] = React.useState("");
  const [clinicalWeight, setClinicalWeight] = React.useState("");
  const [formKey, setFormKey] = React.useState(0);
  const bmi = React.useMemo(() => calculateBmi(height, weight), [height, weight]);
  const clinicalBmi = React.useMemo(() => calculateBmi(clinicalHeight, clinicalWeight), [clinicalHeight, clinicalWeight]);
  const activeTabIndex = patientDetailTabs.findIndex((tab) => tab.id === activeTab);

  function handleDateOfBirthChange(nextDateOfBirth: string) {
    setDateOfBirth(nextDateOfBirth);
    setAge(calculateAge(nextDateOfBirth));
  }

  function goToNextTab() {
    if (!formRef.current?.reportValidity()) return;
    const nextTab = patientDetailTabs[activeTabIndex + 1];
    if (nextTab) {
      setActiveTab(nextTab.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    toast.success("Patient details are ready to continue.");
  }

  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    const target = event.target as HTMLElement;
    if (event.key !== "Enter" || target.tagName === "BUTTON" || target.tagName === "TEXTAREA") return;
    event.preventDefault();
    goToNextTab();
  }

  function handleCancel() {
    setActiveTab("basic");
    toast.info("Patient details entry cancelled.");
  }

  function handleSaveDraft() {
    toast.success("Patient details draft saved locally.");
  }

  function handleClear() {
    setDateOfBirth("");
    setAge("");
    setHeight("");
    setWeight("");
    setClinicalHeight("");
    setClinicalWeight("");
    setFormKey((current) => current + 1);
    setActiveTab("basic");
    toast.info("Patient details form cleared.");
  }

  return (
    <form className="space-y-5" key={formKey} onKeyDown={handleFormKeyDown} ref={formRef}>
      <PageHeader
        eyebrow="Patient Management"
        title="Patient Details"
        description="Capture and manage patient demographic, clinical, admission, referral, diagnosis, and administrative information."
      />

      <div className="pt-4">
        <div className="flex gap-1 overflow-x-auto rounded-md bg-surface-muted p-1" role="tablist" aria-label="Patient detail sections">
          {patientDetailTabs.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className={`h-8 shrink-0 rounded px-3 text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-ring ${
                activeTab === tab.id ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "basic" ? (
          <div className="mt-4">
          <SectionCard icon={UserRound} title="1. Basic Demographics">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <Field label="MRN / Patient ID">
                <Input />
              </Field>
              <Field label="UHID">
                <Input />
              </Field>
              <Field className="xl:col-span-2" label="Patient Name">
                <Input required />
              </Field>
              <Field label="Date of Birth">
                <DateTextInput onChange={handleDateOfBirthChange} required value={dateOfBirth} />
              </Field>
              <Field label="Age">
                <div className="flex items-center gap-2">
                  <Input
                    inputMode="numeric"
                    min="0"
                    onBeforeInput={(event) => preventInvalidNumericInput(event)}
                    onInput={(event) => validateNumericInput(event, "Age")}
                    onChange={(event) => setAge(event.target.value)}
                    onPaste={(event) => preventInvalidNumericPaste(event)}
                    pattern="[0-9]*"
                    required
                    title="Age must contain numbers only."
                    value={age}
                  />
                  <span className="text-xs text-muted-foreground">Years</span>
                </div>
              </Field>
              <div className="space-y-2">
                <span className={labelClass}>Gender</span>
                <div className="flex flex-wrap gap-4 pt-2">
                  <RadioOption label="Male" name="gender" />
                  <RadioOption label="Female" name="gender" />
                  <RadioOption label="Other" name="gender" />
                </div>
              </div>
              <Field label="Blood Group">
                <select className={selectClass}>
                  <option value="">Select</option>
                  {bloodGroupOptions.map((bloodGroup) => (
                    <option key={bloodGroup}>{bloodGroup}</option>
                  ))}
                </select>
              </Field>
              <Field label="Height">
                <div className="flex items-center gap-2">
                  <Input
                    inputMode="decimal"
                    min="0"
                    onBeforeInput={(event) => preventInvalidNumericInput(event, true)}
                    onInput={(event) => validateNumericInput(event, "Height", true)}
                    onChange={(event) => setHeight(event.target.value)}
                    onPaste={(event) => preventInvalidNumericPaste(event, true)}
                    pattern="[0-9]*\\.?[0-9]*"
                    title="Height must contain numbers only."
                    value={height}
                  />
                  <span className="text-xs text-muted-foreground">cm</span>
                </div>
              </Field>
              <Field label="Weight">
                <div className="flex items-center gap-2">
                  <Input
                    inputMode="decimal"
                    min="0"
                    onBeforeInput={(event) => preventInvalidNumericInput(event, true)}
                    onInput={(event) => validateNumericInput(event, "Weight", true)}
                    onChange={(event) => setWeight(event.target.value)}
                    onPaste={(event) => preventInvalidNumericPaste(event, true)}
                    pattern="[0-9]*\\.?[0-9]*"
                    title="Weight must contain numbers only."
                    value={weight}
                  />
                  <span className="text-xs text-muted-foreground">kg</span>
                </div>
              </Field>
              <Field label="BMI (Auto)">
                <div className="flex items-center gap-2">
                  <Input readOnly value={bmi} />
                  <span className="text-xs text-muted-foreground">kg/m2</span>
                </div>
              </Field>
              <Field label="Contact Number">
                <Input inputMode="numeric" maxLength={15} minLength={10} onBeforeInput={(event) => preventInvalidNumericInput(event)} onInput={(event) => validateNumericInput(event, "Contact number")} onPaste={(event) => preventInvalidNumericPaste(event)} pattern="[0-9]*" required title="Contact number must contain numbers only." />
              </Field>
              <Field label="Email ID">
                <Input type="email" />
              </Field>
              <Field className="md:col-span-2" label="Address">
                <Input />
              </Field>
              <Field label="City">
                <Input />
              </Field>
              <Field label="State">
                <Input />
              </Field>
              <Field label="PIN Code">
                <Input inputMode="numeric" maxLength={6} minLength={6} onBeforeInput={(event) => preventInvalidNumericInput(event)} onInput={(event) => validateNumericInput(event, "PIN code")} onPaste={(event) => preventInvalidNumericPaste(event)} pattern="[0-9]*" required title="PIN code must contain 6 digits only." />
              </Field>
            </div>
          </SectionCard>
          </div>
        ) : null}

        {activeTab === "clinical" ? (
          <div className="mt-4">
          <SectionCard icon={HeartPulse} title="2. Physical & Clinical Information">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <Field label="Blood Group (Reconfirm)">
                <select className={selectClass}>
                  <option>Select</option>
                  {bloodGroupOptions.map((bloodGroup) => (
                    <option key={bloodGroup}>{bloodGroup}</option>
                  ))}
                </select>
              </Field>
              <Field label="Height">
                <div className="flex items-center gap-2">
                  <Input
                    inputMode="decimal"
                    min="0"
                    onBeforeInput={(event) => preventInvalidNumericInput(event, true)}
                    onInput={(event) => validateNumericInput(event, "Height", true)}
                    onChange={(event) => setClinicalHeight(event.target.value)}
                    onPaste={(event) => preventInvalidNumericPaste(event, true)}
                    pattern="[0-9]*\\.?[0-9]*"
                    title="Height must contain numbers only."
                    value={clinicalHeight}
                  />
                  <span className="text-xs text-muted-foreground">cm</span>
                </div>
              </Field>
              <Field label="Weight">
                <div className="flex items-center gap-2">
                  <Input
                    inputMode="decimal"
                    min="0"
                    onBeforeInput={(event) => preventInvalidNumericInput(event, true)}
                    onInput={(event) => validateNumericInput(event, "Weight", true)}
                    onChange={(event) => setClinicalWeight(event.target.value)}
                    onPaste={(event) => preventInvalidNumericPaste(event, true)}
                    pattern="[0-9]*\\.?[0-9]*"
                    title="Weight must contain numbers only."
                    value={clinicalWeight}
                  />
                  <span className="text-xs text-muted-foreground">kg</span>
                </div>
              </Field>
              <Field label="BMI (Auto)">
                <div className="flex items-center gap-2">
                  <Input readOnly value={clinicalBmi} />
                  <span className="text-xs text-muted-foreground">kg/m2</span>
                </div>
              </Field>
              <div className="space-y-2">
                <span className={labelClass}>Bed Sores at Time of Admission</span>
                <div className="grid gap-2 pt-1">
                  <RadioOption label="Present" name="bedSores" />
                  <RadioOption label="Not Present" name="bedSores" />
                </div>
              </div>
              <Field label="If Present Stage">
                <select className={selectClass}>
                  <option>Select</option>
                  <option>Stage 1</option>
                  <option>Stage 2</option>
                  <option>Stage 3</option>
                </select>
              </Field>
              <Field className="xl:col-span-2" label="Location">
                <Input placeholder="Enter location" />
              </Field>
            </div>
          </SectionCard>
          </div>
        ) : null}

        {activeTab === "admission" ? (
          <div className="mt-4">
          <SectionCard icon={ClipboardList} title="3. Admission Information">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2 md:col-span-2">
                <span className={labelClass}>Admitted Through</span>
                <div className="flex flex-wrap gap-6 pt-1">
                  <RadioOption label="ER (Emergency)" name="admittedThrough" />
                  <RadioOption label="OPD (Outpatient Department)" name="admittedThrough" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <span className={labelClass}>Source of Admission</span>
                <div className="flex flex-wrap gap-6 pt-1">
                  <RadioOption label="Fresh Admission" name="sourceAdmission" />
                  <RadioOption label="Transfer Case" name="sourceAdmission" />
                </div>
              </div>
              <Field label="Date of Admission">
                <DateTextInput required />
              </Field>
              <Field label="Time of Admission">
                <Input required type="time" />
              </Field>
              <Field className="md:col-span-2" label="Admitting Department">
                <select className={selectClass} required>
                  <option value="">Select Department</option>
                  <option>Emergency</option>
                  <option>Medicine</option>
                  <option>Surgery</option>
                  <option>Orthopedics</option>
                </select>
              </Field>
              <Field className="md:col-span-2" label="Bed / Unit / Room No.">
                <Input placeholder="Enter bed / unit / room no." required />
              </Field>
            </div>
          </SectionCard>
          </div>
        ) : null}

        {activeTab === "referral" ? (
          <div className="mt-4">
          <SectionCard icon={FileBadge} title="4. Referral Information">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.4fr_1fr]">
              <Field label="Referred By (Dr. / Facility Name)">
                <Input />
              </Field>
              <Field label="Referred From">
                <Input />
              </Field>
              <div className="space-y-2 rounded-md border border-border bg-surface-muted/40 p-3">
                <span className={labelClass}>Referral Type</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                  <RadioOption label="Self" name="referralType" />
                  <RadioOption label="Doctor" name="referralType" />
                  <RadioOption label="Hospital / Facility" name="referralType" />
                  <RadioOption label="Others" name="referralType" />
                </div>
              </div>
              <Field label="Referral Contact">
                <Input />
              </Field>
              <Field className="md:col-span-2 xl:col-span-4" label="Referral Notes">
                <Input placeholder="Enter referral notes (if any)" />
              </Field>
            </div>
          </SectionCard>
          </div>
        ) : null}

        {activeTab === "diagnosis" ? (
          <div className="mt-4">
          <SectionCard icon={FileSearch} title="5. Diagnosis Information">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Primary Diagnosis (ICD Code)">
                <SearchInput placeholder="Search ICD Code..." />
              </Field>
              <Field label="ICD Code Description">
                <Input />
              </Field>
              <div className="space-y-2">
                <span className={labelClass}>Diagnosis Type</span>
                <div className="flex flex-wrap gap-4 pt-2">
                  <RadioOption label="Provisional" name="diagnosisType" />
                  <RadioOption label="Confirmed" name="diagnosisType" />
                  <RadioOption label="Differential" name="diagnosisType" />
                </div>
              </div>
              <Field label="Date of Diagnosis">
                <DateTextInput required />
              </Field>
              <Field label="Secondary Diagnosis (ICD Code)">
                <SearchInput placeholder="Search ICD Code..." />
              </Field>
              <Field label="ICD Code Description">
                <Input />
              </Field>
              <Field className="md:col-span-2" label="Additional Diagnosis Notes">
                <Input placeholder="Enter notes (if any)" />
              </Field>
            </div>
          </SectionCard>
          </div>
        ) : null}

        {activeTab === "additional" ? (
          <div className="mt-4">
          <SectionCard icon={HeartPulse} title="6. Additional Clinical Information">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <Field label="Allergies">
                <Input placeholder="Enter allergies" />
              </Field>
              <Field label="Comorbidities">
                <Input placeholder="Enter comorbidities" />
              </Field>
              <Field label="Smoking Status">
                <select className={selectClass}>
                  <option>Select</option>
                  <option>Never</option>
                  <option>Former</option>
                  <option>Current</option>
                </select>
              </Field>
              <Field label="Alcohol Use">
                <select className={selectClass}>
                  <option>Select</option>
                  <option>No</option>
                  <option>Occasional</option>
                  <option>Regular</option>
                </select>
              </Field>
              <div className="space-y-2">
                <span className={labelClass}>Advance Directive</span>
                <div className="flex flex-wrap gap-4 pt-2">
                  <RadioOption label="Yes" name="advanceDirective" />
                  <RadioOption label="No" name="advanceDirective" />
                  <RadioOption label="Not Known" name="advanceDirective" />
                </div>
              </div>
              <Field className="md:col-span-2 xl:col-span-5" label="Notes">
                <Input placeholder="Enter additional clinical notes" />
              </Field>
            </div>
          </SectionCard>
          </div>
        ) : null}

        {activeTab === "admin" ? (
          <div className="mt-4">
          <SectionCard icon={IdCard} title="7. Administrative Information">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Created By">
                <Input required />
              </Field>
              <Field label="Created Date & Time">
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem]">
                  <DateTextInput required />
                  <Input required type="time" />
                </div>
              </Field>
              <Field label="Last Updated By">
                <Input />
              </Field>
              <Field label="Last Updated Date & Time">
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem]">
                  <DateTextInput />
                  <Input type="time" />
                </div>
              </Field>
              <SignatureUpload label="Prepared By Signature" />
              <SignatureUpload label="Verified By Signature" />
            </div>
          </SectionCard>
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button onClick={handleCancel} size="sm" type="button" variant="outline">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <div className="flex flex-wrap justify-end gap-2">
            <Button onClick={handleSaveDraft} size="sm" type="button" variant="outline">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleClear} size="sm" type="button" variant="outline">
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
            <Button onClick={goToNextTab} size="sm" type="button">
              Save & Continue
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
