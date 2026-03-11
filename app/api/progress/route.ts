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
    const startHour = (start.getHours() + start.getMinutes()) / 60;

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
  });

  return Response.json({
    day: {
      totalSeconds: totalTodaySeconds,
      sessionCount: todayFocusSessions.length,
      averageSessionMinutes:
        todayFocusSessions.length === 0
          ? 0
          : Math.round(totalTodaySeconds / todayFocusSessions.length / 60),
      timeLine,
      recentSessions,
    },
    week: {
      weekData,
    },
  });
}
