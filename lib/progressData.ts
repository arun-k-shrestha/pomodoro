import { TimelineSegment } from "@/components/progress/charts/Timeline";
import { Session } from "@/components/progress/charts/RecentSessions";

export const DAY_DATA = [
  { day: "Mon", hours: 3.8 },
  { day: "Tue", hours: 4.9 },
  { day: "Wed", hours: 2.4 },
  { day: "Thu", hours: 6.3 },
  { day: "Fri", hours: 4.4 },
  { day: "Sat", hours: 1.5 },
  { day: "Sun", hours: 0 },
];

export const WEEK_DATA = [
  { label: "Sunday", hours: 0 },
  { label: "Monday", hours: 1 },
  { label: "Tuesday", hours: 10 },
  { label: "Wednesday", hours: 7 },
  { label: "Thursday", hours: 8 },
  { label: "Friday", hours: 0 },
  { label: "Saturday", hours: 0 },
];

export const MONTH_DATA = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  hours: parseFloat((Math.random() * 7).toFixed(1)),
}));

export const OVER_TIME_DATA = [
  { month: "Jan", hours: 4 },
  { month: "Feb", hours: 14 },
  { month: "Mar", hours: 22 },
  { month: "Apr", hours: 55 },
  { month: "May", hours: 75 },
  { month: "Jun", hours: 90 },
  { month: "Jul", hours: 100 },
  { month: "Aug", hours: 108 },
  { month: "Sep", hours: 112 },
  { month: "Oct", hours: 118 },
  { month: "Nov", hours: 124 },
  { month: "Dec", hours: 127 },
];

export const TIMELINE_DATA: TimelineSegment[] = [
  { startHour: 8.5, durationMin: 25, type: "focus" },
  { startHour: 8.92, durationMin: 5, type: "break" },
  { startHour: 10, durationMin: 25, type: "focus" },
  { startHour: 10.42, durationMin: 5, type: "break" },
  { startHour: 11, durationMin: 25, type: "focus" },
  { startHour: 11.42, durationMin: 5, type: "break" },
  { startHour: 12, durationMin: 55, type: "focus" },
  { startHour: 13.67, durationMin: 5, type: "break" },
  { startHour: 14, durationMin: 25, type: "focus" },
  { startHour: 14.42, durationMin: 50, type: "break" },
  { startHour: 23.5, durationMin: 25, type: "focus" },
];

export const SESSION_DATA: Session[] = [
  {
    startTime: "4:00 PM",
    endTime: "4:25 PM",
    task: "Project Proposal",
    durationMin: 25,
    type: "focus",
  },
  {
    startTime: "3:30 PM",
    endTime: "3:55 PM",
    task: "Code Review",
    durationMin: 25,
    type: "focus",
  },
  {
    startTime: "2:30 PM",
    endTime: "2:55 PM",
    task: "Study: Algorithms. Testing Testing Testing",
    durationMin: 25,
    type: "focus",
  },
];

export const DAY_BREAKDOWN_DATA = [
  { day: "Monday", duration: { hours: 2, minutes: 32 }, sessions: 5 },
  { day: "Tuesday", duration: { hours: 3, minutes: 36 }, sessions: 7 },
  { day: "Wednesday", duration: { hours: 3, minutes: 18 }, sessions: 6 },
  { day: "Thursday", duration: { hours: 6, minutes: 0 }, sessions: 4 },
  { day: "Friday", duration: { hours: 4, minutes: 12 }, sessions: 8 },
  { day: "Saturday", duration: { hours: 1, minutes: 48 }, sessions: 3 },
  { day: "Sunday", duration: { hours: 0, minutes: 54 }, sessions: 2 },
];

export const YEAR_DATA = [
  { label: "Jan", hours: 45 },
  { label: "Feb", hours: 52 },
  { label: "Mar", hours: 60 },
  { label: "Apr", hours: 47 },
  { label: "May", hours: 58 },
  { label: "Jun", hours: 63 },
  { label: "Jul", hours: 55 },
  { label: "Aug", hours: 49 },
  { label: "Sep", hours: 61 },
  { label: "Oct", hours: 57 },
  { label: "Nov", hours: 53 },
  { label: "Dec", hours: 48 },
];

export function generateHeatmap() {
  const weeks: number[][] = [];
  const firstDay = new Date(2026, 0, 1).getDay();
  const cells: number[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(-1);
  for (let d = 0; d < 365; d++) {
    const r = Math.random();
    cells.push(
      r < 0.22 ? 0 : r < 0.4 ? 1 : r < 0.6 ? 2 : r < 0.78 ? 3 : r < 0.9 ? 4 : 5,
    );
  }
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
