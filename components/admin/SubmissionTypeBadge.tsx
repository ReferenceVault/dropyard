import React from "react";
import type { StatusTone } from "./StatusPill";
import { StatusPill } from "./StatusPill";

export type SubmissionType =
  | "CONTACT_GENERAL"
  | "CONTACT_REPORT"
  | "CONTACT_BUG"
  | "CONTACT_FEATURE"
  | "CONTACT_NEIGHBOURHOOD"
  | "CONTACT_PARTNER"
  | "CONTACT_PRESS"
  | "CONTACT_OTHER"
  | "EARLY_ACCESS_SIGNUP"
  | "NEIGHBOURHOOD_WAITLIST"
  | "SELLER_AI_WAITLIST"
  | "LISTING_REPORT"
  | "USER_REPORT";

export type SubmissionStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "SPAM";

export const SUBMISSION_TYPE_META: Record<
  SubmissionType,
  { label: string; group: string; tone: StatusTone }
> = {
  CONTACT_GENERAL:        { label: "General",          group: "Contact",  tone: "sky" },
  CONTACT_REPORT:         { label: "Report",           group: "Reports",  tone: "rose" },
  CONTACT_BUG:            { label: "Bug",              group: "Bugs",     tone: "amber" },
  CONTACT_FEATURE:        { label: "Feature idea",     group: "Features", tone: "violet" },
  CONTACT_NEIGHBOURHOOD:  { label: "Neighbourhood",    group: "Waitlist", tone: "emerald" },
  CONTACT_PARTNER:        { label: "Partnership",      group: "Contact",  tone: "emerald" },
  CONTACT_PRESS:          { label: "Press / media",    group: "Contact",  tone: "sky" },
  CONTACT_OTHER:          { label: "Other",            group: "Contact",  tone: "slate" },
  EARLY_ACCESS_SIGNUP:    { label: "Early access",     group: "Waitlist", tone: "emerald" },
  NEIGHBOURHOOD_WAITLIST: { label: "N'hood waitlist",  group: "Waitlist", tone: "amber" },
  SELLER_AI_WAITLIST:     { label: "AI Seller waitlist", group: "Waitlist", tone: "violet" },
  LISTING_REPORT:         { label: "Listing report",   group: "Reports",  tone: "rose" },
  USER_REPORT:            { label: "User report",      group: "Reports",  tone: "rose" },
};

export const SUBMISSION_STATUS_META: Record<
  SubmissionStatus,
  { label: string; tone: StatusTone }
> = {
  NEW:         { label: "New",         tone: "amber" },
  IN_PROGRESS: { label: "In progress", tone: "sky" },
  RESOLVED:    { label: "Resolved",    tone: "emerald" },
  SPAM:        { label: "Spam",        tone: "slate" },
};

export function SubmissionTypeBadge({ type }: { type: SubmissionType }) {
  const meta = SUBMISSION_TYPE_META[type];
  return <StatusPill label={meta.label} tone={meta.tone} />;
}

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  const meta = SUBMISSION_STATUS_META[status];
  return <StatusPill label={meta.label} tone={meta.tone} withDot />;
}
