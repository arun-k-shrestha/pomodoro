import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { error } from "console";
import { format } from "path";

type PomodoroSessionRow = {
  id: string;
  task: string | null;
  type: "focus" | "break";
  started_at: string;
  ended_at: string | null;
  actual_duration_seconds: number | null;
};

function hoursFromSeconds(seconds: number) {
  return Number((seconds / 3600).toFixed(1));
}

function formatTime(value: string | null) {
  if (!value) return "--";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function dateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Streak
function countPomodoroStreak(sessions: PomodoroSessionRow[]) {
  const usedDays = new Set(
    sessions
      .filter((s) => s.type === "focus" && (s.actual_duration_seconds ?? 0) > 0)
      .map((s) => dateKey(new Date(s.started_at))),
  );

  let streak = 0;
  const currentDay = new Date();

  while (usedDays.has(dateKey(currentDay))) {
    streak += 1;
    currentDay.setDate(currentDay.getDate() - 1);
  }

  return streak;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.query<PomodoroSessionRow>(
    `select id, task, type, started_at, ended_at, actual_duration_seconds
    from pomodoro_sessions
    where user_email = $1 and status = 'completed'
    order by started_at desc`,
    [session.user.email],
  );

  const sessions = result.rows;
  const streakDays = countPomodoroStreak(sessions);
  const today = new Date();
  const todayKey = today.toDateString();

  const todaySessions = sessions.filter((s) => {
    return new Date(s.started_at).toDateString() === todayKey;
  });

  const todayFocusSessions = todaySessions.filter((s) => s.type === "focus");
  const totalTodaySeconds = todayFocusSessions.reduce((sum, s) => {
    return sum + (s.actual_duration_seconds ?? 0);
  }, 0);

  const recentSessions = sessions.slice(0, 5).map((s) => ({
    startTime: formatTime(s.started_at),
    endTime: formatTime(s.ended_at),
    task: s.task ?? "Untilted session",
    durationMin: Math.round((s.actual_duration_seconds ?? 0) / 60),
    type: s.type,
  }));

  const timeLine = todaySessions.map((s) => {
    const start = new Date(s.started_at);
    const startHour = start.getHours() + start.getMinutes() / 60;

    return {
      startHour,
      durationMin: Math.round((s.actual_duration_seconds ?? 0) / 60),
      type: s.type,
    };
  });
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const weekData = weekDays.map((label, dayIndex) => {
    const seconds = sessions.reduce((sum, s) => {
      const startedAt = new Date(s.started_at);

      if (s.type !== "focus") return sum;
      if (startedAt.getDay() !== dayIndex) return sum;

      return sum + (s.actual_duration_seconds ?? 0);
    }, 0);
    return {
      label,
      hours: hoursFromSeconds(seconds),
    };
  });

  // last week data extraction

  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setHours(0, 0, 0, 0);
  startOfThisWeek.setDate(now.getDate() - now.getDay());

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  const lastWeekSeconds = sessions.reduce((sum, s) => {
    const startedAt = new Date(s.started_at);
    if (s.type !== "focus") return sum;
    if (startedAt < startOfLastWeek) return sum;
    if (startedAt >= startOfThisWeek) return sum;

    return sum + (s.actual_duration_seconds ?? 0);
  }, 0);

  const lastWeekTotalHours = hoursFromSeconds(lastWeekSeconds);

  // monthly extraction

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const seconds = sessions.reduce((sum, s) => {
      const startedAt = new Date(s.started_at);
      if (s.type !== "focus") return sum;
      if (startedAt.getFullYear() !== currentYear) return sum;
      if (startedAt.getMonth() != currentMonth) return sum;
      if (startedAt.getDate() !== day) return sum;

      return sum + (s.actual_duration_seconds ?? 0);
    }, 0);
    return {
      label: `${day}`,
      hours: hoursFromSeconds(seconds),
    };
  });

  // last month data extraction

  const startOfThisMonth = new Date(currentYear, currentMonth, 1);
  const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);

  const lastMonthSeconds = sessions.reduce((sum, s) => {
    const startedAt = new Date(s.started_at);

    if (s.type !== "focus") return sum;
    if (startedAt < startOfLastMonth) return sum;
    if (startedAt >= startOfThisMonth) return sum;

    return sum + (s.actual_duration_seconds ?? 0);
  }, 0);

  const lastMonthTotalHours = hoursFromSeconds(lastMonthSeconds);

  // yearly extraction

  const yearActiveDays = new Set(
    sessions
      .filter((s) => {
        const startedAt = new Date(s.started_at);

        return (
          s.type === "focus" &&
          (s.actual_duration_seconds ?? 0) > 0 &&
          startedAt.getFullYear() === currentYear
        );
      })
      .map((s) => dateKey(new Date(s.started_at))),
  ).size;

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const yearData = monthLabels.map((label, monthIndex) => {
    const seconds = sessions.reduce((sum, s) => {
      const startedAt = new Date(s.started_at);
      if (s.type !== "focus") return sum;
      if (startedAt.getFullYear() !== currentYear) return sum;
      if (startedAt.getMonth() !== monthIndex) return sum;
      return sum + (s.actual_duration_seconds ?? 0);
    }, 0);

    return {
      label,
      hours: hoursFromSeconds(seconds),
    };
  });

  return Response.json({
    day: {
      totalSeconds: totalTodaySeconds,
      sessionCount: todayFocusSessions.length,
      averageSessionMinutes:
        todayFocusSessions.length === 0
          ? 0
          : Math.round(totalTodaySeconds / todayFocusSessions.length / 60),
      streakDays,
      timeLine,
      recentSessions,
    },
    week: {
      weekData,
      lastWeekTotalHours,
    },
    month: {
      monthData,
      lastMonthTotalHours,
    },
    year: {
      yearData,
      yearActiveDays,
    },
  });
}
