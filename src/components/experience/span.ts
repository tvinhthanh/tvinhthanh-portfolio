import { roles, type Role } from "@/content/profile";

/**
 * Shared date maths for the experience section. Two roles genuinely ran at the
 * same time, so overlap is computed rather than assumed away — the chart and
 * the timeline both read from here and cannot disagree.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Months since year zero, so intervals compare with plain arithmetic. */
export function toMonths(value: string) {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + (month - 1);
}

export function nowMonths() {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
}

export function endOf(role: Role) {
  return role.end ? toMonths(role.end) : nowMonths();
}

export function label(value: string) {
  const [year, month] = value.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function labelFromMonths(m: number) {
  return `${MONTHS[m % 12]} ${Math.floor(m / 12)}`;
}

export function duration(role: Role) {
  const months = Math.max(1, endOf(role) - toMonths(role.start));
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${months} mo`;
  return rest === 0 ? `${years} yr` : `${years} yr ${rest} mo`;
}

export function overlaps(a: Role, b: Role) {
  return toMonths(a.start) < endOf(b) && toMonths(b.start) < endOf(a);
}

export function concurrentWith(role: Role) {
  return roles.filter((other) => other.id !== role.id && overlaps(role, other));
}

/**
 * The stretch during which more than one role was running — the union of every
 * pairwise overlap, so three concurrent roles are covered as readily as two.
 */
export function concurrencyWindow() {
  let from = Infinity;
  let to = -Infinity;

  for (let i = 0; i < roles.length; i++) {
    for (let j = i + 1; j < roles.length; j++) {
      if (!overlaps(roles[i], roles[j])) continue;
      from = Math.min(from, Math.max(toMonths(roles[i].start), toMonths(roles[j].start)));
      to = Math.max(to, Math.min(endOf(roles[i]), endOf(roles[j])));
    }
  }

  return from === Infinity ? null : { from, to };
}

/** How many roles were running at the busiest point. */
export function peakConcurrency() {
  let peak = 1;
  for (let m = timelineStart; m <= timelineEnd; m++) {
    const n = roles.filter((r) => toMonths(r.start) <= m && m < endOf(r)).length;
    if (n > peak) peak = n;
  }
  return peak;
}

export const timelineStart = Math.min(...roles.map((r) => toMonths(r.start)));
export const timelineEnd = Math.max(...roles.map(endOf));

export const timeline = { start: timelineStart, end: timelineEnd };
