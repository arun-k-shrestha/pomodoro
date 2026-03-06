import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.query(
    `
        select
          id,
          title,
          completed,
          started_at,
          completed_at,
          session_name,
          completion_duration_seconds,
          created_at
        from tasks
        where user_email = $1
          and completed = false
        order by created_at desc
      `,
    [session.user.email],
  );

  return Response.json({ tasks: result.rows });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    startedAt?: string;
    completed?: boolean;
    completedAt?: string;
    sessionName?: string | null;
  };
  const title = body.title?.trim();

  if (!title) {
    return Response.json({ error: "Task title is required" }, { status: 400 });
  }
  const startedAt = body.startedAt ? new Date(body.startedAt) : new Date();
  const completed = body.completed === true;
  const completedAt = completed
    ? body.completedAt
      ? new Date(body.completedAt)
      : new Date()
    : null;

  const durationSeconds =
    completed && completedAt
      ? Math.max(
          0,
          Math.round((completedAt.getTime() - startedAt.getTime()) / 1000),
        )
      : null;

  const result = await db.query(
    `
        insert into tasks (
          user_email,
          title,
          completed,
          started_at,
          completed_at,
          session_name,
          completion_duration_seconds
        )
        values ($1, $2, $3, $4, $5, $6, $7)
        returning
          id,
          title,
          completed,
          started_at,
          completed_at,
          session_name,
          completion_duration_seconds,
          created_at
      `,
    [
      session.user.email,
      title,
      completed,
      startedAt.toISOString(),
      completedAt?.toISOString() ?? null,
      body.sessionName ?? null,
      durationSeconds,
    ],
  );

  return Response.json({ task: result.rows[0] }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // CHANGE: complete an existing saved task.
  const body = (await request.json()) as {
    id?: string;
    completedAt?: string;
  };

  if (!body.id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const completedAt = body.completedAt
    ? new Date(body.completedAt)
    : new Date();

  const result = await db.query(
    `
        update tasks
        set
          completed = true,
          completed_at = $1,
          completion_duration_seconds = greatest(
            0,
            round(extract(epoch from ($1::timestamptz -
started_at)))::integer
          ),
          updated_at = now()
        where id = $2
          and user_email = $3
        returning
          id,
          title,
          completed,
          started_at,
          completed_at,
          session_name,
          completion_duration_seconds,
          created_at
      `,
    [completedAt.toISOString(), body.id, session.user.email],
  );

  if (result.rowCount === 0) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }

  return Response.json({ task: result.rows[0] });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  await db.query(`DELETE FROM tasks WHERE id = $1 AND user_email = $2`, [
    id,
    session.user.email,
  ]);

  return new Response(null, { status: 204 });
}
