/**
 * Drop Cycle Logic - BRD Section 4.1
 *
 * Mon-Wed:  Submission - Sellers upload items for upcoming Drop
 * Thu-Fri:  Preview - Buyers browse and save, no claiming
 * Sat 8am:  DROP GOES LIVE - Claiming opens
 * Sat-Sun:  Claim & Pickup - 48-hour window
 * Sun 8pm:  Drop closes
 */

export type DropPhase =
  | "SUBMISSION"   // Mon 00:00 - Wed 23:59
  | "PREVIEW"      // Thu 00:00 - Sat 07:59
  | "LIVE"         // Sat 08:00 - Sun 20:00
  | "CLOSED";      // Sun 20:01 - Mon 00:00

export interface DropCycleInfo {
  phase: DropPhase;
  /** Sellers can list items for the upcoming Drop */
  canSellersList: boolean;
  /** Buyers can browse and save (preview mode) */
  canBuyersBrowse: boolean;
  /** Buyers can submit claims */
  canBuyersClaim: boolean;
  /** Human-readable phase label */
  phaseLabel: string;
  /** Short description for UI */
  phaseDescription: string;
  /** Next significant moment (e.g. "Saturday 8:00 AM" when Drop goes live) */
  nextEventAt: Date;
  /** Label for next event (e.g. "Drop goes live", "Submission opens") */
  nextEventLabel: string;
  /** Current Drop weekend (Saturday date) */
  currentDropDate: Date;
  /** Day names for display */
  dayNames: string[];
}

/** Get the Saturday 8am of the current Drop (or next Drop if we're in CLOSED phase) */
function getCurrentDropSaturday(ref: Date): Date {
  const d = new Date(ref);
  const day = d.getDay();
  const hour = d.getHours();

  // Sunday after 8pm: next week's Saturday
  if (day === 0 && hour >= 20) {
    d.setDate(d.getDate() + 6);
    d.setHours(8, 0, 0, 0);
    return d;
  }

  if (day === 0) {
    d.setDate(d.getDate() - 1); // yesterday = Saturday
  } else if (day < 6) {
    d.setDate(d.getDate() + (6 - day)); // this week's Saturday
  }
  d.setHours(8, 0, 0, 0);
  return d;
}

/** Get Monday 00:00 of the submission week (Mon before Drop Saturday) */
function getSubmissionMonday(sat: Date): Date {
  const mon = new Date(sat);
  mon.setDate(mon.getDate() - 5);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

/** Get Thursday 00:00 (start of Preview) */
function getPreviewThursday(sat: Date): Date {
  const thu = new Date(sat);
  thu.setDate(thu.getDate() - 2);
  thu.setHours(0, 0, 0, 0);
  return thu;
}

/** Get Sunday 20:00 (8pm - Drop closes) */
function getDropCloseSunday(sat: Date): Date {
  const sun = new Date(sat);
  sun.setDate(sun.getDate() + 1);
  sun.setHours(20, 0, 0, 0);
  return sun;
}

export function getDropCycleInfo(now: Date = new Date()): DropCycleInfo {
  const liveSat = getCurrentDropSaturday(now);
  const submissionMon = getSubmissionMonday(liveSat);
  const previewThu = getPreviewThursday(liveSat);
  const closeSun = getDropCloseSunday(liveSat);
  const time = now.getTime();
  const sMon = submissionMon.getTime();
  const pThu = previewThu.getTime();
  const lSat = liveSat.getTime();
  const cSun = closeSun.getTime();

  let phase: DropPhase = "CLOSED";
  let nextEventAt: Date = submissionMon;
  let nextEventLabel = "Submission opens";

  if (time >= sMon && time < pThu) {
    phase = "SUBMISSION";
    nextEventAt = previewThu;
    nextEventLabel = "Preview begins (browse only)";
  } else if (time >= pThu && time < lSat) {
    phase = "PREVIEW";
    nextEventAt = liveSat;
    nextEventLabel = "Drop goes live — claiming opens!";
  } else if (time >= lSat && time <= cSun) {
    phase = "LIVE";
    nextEventAt = closeSun;
    nextEventLabel = "Drop closes";
  } else {
    phase = "CLOSED";
    nextEventAt = submissionMon; // Submission opens Monday (liveSat already points to next Drop)
    nextEventLabel = "Submission opens for next Drop";
  }

  const phaseMeta: Record<
    DropPhase,
    { label: string; description: string; canList: boolean; canBrowse: boolean; canClaim: boolean }
  > = {
    SUBMISSION: {
      label: "Submission window",
      description: "Sellers can add items for this weekend's Drop. Buyers: browse opens Thursday.",
      canList: true,
      canBrowse: false,
      canClaim: false,
    },
    PREVIEW: {
      label: "Preview mode",
      description: "Browse and save items. Claiming opens Saturday 8am!",
      canList: false,
      canBrowse: true,
      canClaim: false,
    },
    LIVE: {
      label: "Drop is live!",
      description: "Claim items now. Pickup this weekend.",
      canList: false,
      canBrowse: true,
      canClaim: true,
    },
    CLOSED: {
      label: "Drop closed",
      description: "Next submission opens Monday. Stay tuned!",
      canList: false,
      canBrowse: false,
      canClaim: false,
    },
  };

  const meta = phaseMeta[phase];
  const currentDropDate = liveSat;

  return {
    phase,
    canSellersList: meta.canList,
    canBuyersBrowse: meta.canBrowse,
    canBuyersClaim: meta.canClaim,
    phaseLabel: meta.label,
    phaseDescription: meta.description,
    nextEventAt,
    nextEventLabel,
    currentDropDate,
    dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  };
}

/** Format date for display (e.g. "Sat, Mar 22") */
export function formatDropDate(d: Date): string {
  return d.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Format time for display (e.g. "8:00 AM") */
export function formatDropTime(d: Date): string {
  return d.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
