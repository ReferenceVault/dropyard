/**
 * Drop Cycle Logic - BRD Section 4.1
 *
 * Mon-Wed:  Submission - Sellers upload items for upcoming Drop
 * Thu-Fri:  Preview - Buyers browse and save, no claiming
 * Sat 8am:  DROP GOES LIVE - Claiming opens
 * Sat-Sun:  Claim & Pickup - 48-hour window
 * Sun 8pm:  Drop closes
 */

// ─────────────────────────────────────────────────────────────────
// CANONICAL DROP TIMING
// Single source of truth for what time the Drop opens and closes.
// EVERY surface that displays the drop time (dashboards, marketing
// pages, FAQ, emails) MUST read from these constants or the format
// helpers below. Adding a new "Saturday 8 AM" anywhere is a bug.
// ─────────────────────────────────────────────────────────────────

/** Day the Drop opens (0 = Sunday, 6 = Saturday). */
export const DROP_OPEN_DAY  = 6;
/** Hour the Drop opens, 24-hour. 8 = 8 AM. */
export const DROP_OPEN_HOUR = 8;
/** Day the Drop closes. */
export const DROP_CLOSE_DAY  = 0;
/** Hour the Drop closes. 20 = 8 PM. */
export const DROP_CLOSE_HOUR = 20;

const DAYS_FULL  = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatHour12(h24: number, style: "AM" | "am" | "a.m." | "amSpaced"): string {
  const display = h24 > 12 ? h24 - 12 : h24 === 0 ? 12 : h24;
  const isPM = h24 >= 12 && h24 < 24;
  switch (style) {
    case "AM":       return `${display} ${isPM ? "PM" : "AM"}`;
    case "am":       return `${display}${isPM ? "pm" : "am"}`;
    case "a.m.":     return `${display} ${isPM ? "p.m." : "a.m."}`;
    case "amSpaced": return `${display} ${isPM ? "pm" : "am"}`;
  }
}

/** "8 AM" — banner / headline style. */
export function dropOpenHour(): string { return formatHour12(DROP_OPEN_HOUR, "AM"); }
/** "8am" — compact lowercase, no space. */
export function dropOpenHourCompact(): string { return formatHour12(DROP_OPEN_HOUR, "am"); }
/** "8 am" — lowercase with space (marketing copy). */
export function dropOpenHourLowerSpaced(): string { return formatHour12(DROP_OPEN_HOUR, "amSpaced"); }
/** "8 a.m." — dotted. */
export function dropOpenHourDotted(): string { return formatHour12(DROP_OPEN_HOUR, "a.m."); }
/** "8AM" — no space + uppercase for compact badges. */
export function dropOpenHourBadge(): string {
  return formatHour12(DROP_OPEN_HOUR, "AM").replace(" ", "");
}

/** "Saturday" (default) / "Sat" (short). */
export function dropOpenDay(short = false): string {
  return short ? DAYS_SHORT[DROP_OPEN_DAY] : DAYS_FULL[DROP_OPEN_DAY];
}

/** "Saturday at 8 AM" — banner-headline composite. */
export function dropOpenFull(): string {
  return `${dropOpenDay()} at ${dropOpenHour()}`;
}

/** "8:00 AM" — explicit minute style for FAQ / legal copy. */
export function dropOpenHourLong(): string {
  return dropOpenHour().replace(" ", ":00 ");
}

/** "6:00 PM" — close hour explicit minute style. */
export function dropCloseHourLong(): string {
  return dropCloseHour().replace(" ", ":00 ");
}

/** "8 PM" close-hour label. */
export function dropCloseHour(): string { return formatHour12(DROP_CLOSE_HOUR, "AM"); }
/** "Sunday" close-day label. */
export function dropCloseDay(short = false): string {
  return short ? DAYS_SHORT[DROP_CLOSE_DAY] : DAYS_FULL[DROP_CLOSE_DAY];
}

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

/** Get the Drop-opening moment (Saturday 8am by default) of the current
 *  Drop, or next Drop if we're past close on Sunday. */
function getCurrentDropSaturday(ref: Date): Date {
  const d = new Date(ref);
  const day = d.getDay();
  const hour = d.getHours();

  // Past the close moment (Sunday 8pm by default): next week's open day.
  if (day === DROP_CLOSE_DAY && hour >= DROP_CLOSE_HOUR) {
    d.setDate(d.getDate() + 6);
    d.setHours(DROP_OPEN_HOUR, 0, 0, 0);
    return d;
  }

  if (day === DROP_CLOSE_DAY) {
    d.setDate(d.getDate() - 1); // yesterday = open day
  } else if (day < DROP_OPEN_DAY) {
    d.setDate(d.getDate() + (DROP_OPEN_DAY - day)); // this week's open day
  }
  d.setHours(DROP_OPEN_HOUR, 0, 0, 0);
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

/** Get the Drop-close moment (Sunday 8pm by default) given the open Saturday */
function getDropCloseSunday(sat: Date): Date {
  const sun = new Date(sat);
  sun.setDate(sun.getDate() + 1);
  sun.setHours(DROP_CLOSE_HOUR, 0, 0, 0);
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
      description: `Browse and save items. Claiming opens ${dropOpenDay()} ${dropOpenHourCompact()}!`,
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

// ─────────────────────────────────────────────────────────────────
// V2 SELLER OVERVIEW HELPERS
// The seller Overview component derives three coarse phases from the
// cycle info above:
//   "between" — anything except LIVE (sellers prepping, post-Drop recap)
//   "live"    — LIVE phase with > 3 hours of selling time left
//   "closing" — LIVE phase with ≤ 3 hours left (urgency cue, "last call")
// Helpers below compute the times + countdowns the Overview needs.
// ─────────────────────────────────────────────────────────────────

export type SellerOverviewPhase = "between" | "live" | "closing";

/** Sunday 20:00 of the currently-relevant Drop weekend. */
export function dropCloseMoment(now: Date = new Date()): Date {
  const info = getDropCycleInfo(now);
  return getDropCloseSunday(info.currentDropDate);
}

/** Saturday 08:00 of the next Drop weekend (or the current one if we're already in/past LIVE). */
export function nextDropMoment(now: Date = new Date()): Date {
  const info = getDropCycleInfo(now);
  return new Date(info.currentDropDate);
}

/** Map the rich DropPhase → coarse seller-Overview phase. */
export function toSellerOverviewPhase(
  info: DropCycleInfo,
  now: Date = new Date(),
  closingThresholdHours = 3,
): SellerOverviewPhase {
  if (info.phase !== "LIVE") return "between";
  const closeAt = getDropCloseSunday(info.currentDropDate);
  const msLeft = closeAt.getTime() - now.getTime();
  if (msLeft <= closingThresholdHours * 60 * 60 * 1000) return "closing";
  return "live";
}

/**
 * Hours elapsed since the previous Drop closed (Sun 8 pm of last week).
 * Useful for the "fresh recap" window in BetweenHero — we treat the first
 * ~30h after a Drop closes as "fresh" and lead with the recap.
 */
export function hoursSinceLastDropClose(now: Date = new Date()): number {
  const info = getDropCycleInfo(now);
  // Last-Drop close = current Drop Saturday - 6 days + ${DROP_CLOSE_HOUR}h (prior week's close).
  const lastClose = new Date(info.currentDropDate);
  lastClose.setDate(lastClose.getDate() - 6);
  lastClose.setHours(DROP_CLOSE_HOUR, 0, 0, 0);
  const ms = now.getTime() - lastClose.getTime();
  return ms / (60 * 60 * 1000);
}

/**
 * Compact countdown like the v2 design: "2d 14h", "4h 23m", "12m", "30s".
 * Differs from the existing DropCycleContext label by omitting seconds
 * above the minute scale (the Overview doesn't want a ticking second hand).
 */
export function formatCompactCountdown(target: Date, now: Date = new Date()): string {
  const ms = Math.max(0, target.getTime() - now.getTime());
  if (ms <= 0) return "now";
  const totalSec = Math.floor(ms / 1000);
  const days  = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins  = Math.floor((totalSec % 3600) / 60);
  const secs  = totalSec % 60;
  if (days > 0)  return mins > 0 || hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  if (hours > 0) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  if (mins > 0)  return `${mins}m`;
  return `${secs}s`;
}
