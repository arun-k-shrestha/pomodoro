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
        select id, title, completed, created_at
        from tasks
        where user_email = $1
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

  const body = (await request.json()) as { title?: string };
  const title = body.title?.trim();

  if (!title) {
    return Response.json({ error: "Task title is required" }, { status: 400 });
  }

  const result = await db.query(
    `
        insert into tasks (user_email, title)
        values ($1, $2)
        returning id, title, completed, created_at
      `,
    [session.user.email, title],
  );

  return Response.json({ task: result.rows[0] }, { status: 201 });
}
