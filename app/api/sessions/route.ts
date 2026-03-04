import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { MODES, type Mode } from "@/lib/constants";

type CreateSessionBody = {
  mode: Mode;
  task?: string | null;
  startedAt?: string;
};

function isMode(value: unknown): value is Mode {
  return typeof value === "string" && value in MODES;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CreateSessionBody;

  if (!isMode(body.mode)) {
    return Response.json({ error: "Invalid mode" }, { status: 400 });
  }

  const type = body.mode === "pomodoro" ? "focus" : "break";
  const startedAt = body.startedAt ? new Date(body.startedAt) : new Date();

  if (Number.isNaN(startedAt.getTime())) {
    return Response.json({ error: "Invalid startedAt" }, { status: 400 });
  }

  const result = await db.query(
    `
        insert into pomodoro_sessions (
          user_email,
          task,
          type,
          mode,
          started_at,
          planned_duration_seconds
        )
        values ($1, $2, $3, $4, $5, $6)
        returning
          id,
          user_email,
          task,
          type,
          mode,
          started_at,
          ended_at,
          planned_duration_seconds,
          actual_duration_seconds,
          status
      `,
    [
      session.user.email,
      body.task ?? null,
      type,
      body.mode,
      startedAt.toISOString(),
      MODES[body.mode].duration,
    ],
  );

  return Response.json({ session: result.rows[0] }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    sessionId: string;
    endedAt: string;
    actualDurationSeconds: number;
  };

  const result = await db.query(
    `UPDATE pomodoro_sessions                                                                                                                       
       SET ended_at = $1, actual_duration_seconds = $2, status = 'completed'
       WHERE id = $3 AND user_email = $4
       RETURNING *`,
    [
      new Date(body.endedAt).toISOString(),
      body.actualDurationSeconds,
      body.sessionId,
      session.user.email,
    ],
  );

  if (!result.rows[0])
    return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ session: result.rows[0] });
}
