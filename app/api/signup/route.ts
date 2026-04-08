import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const name = body.name?.trim();
  const email = body.email?.toLowerCase().trim();
  const password = body.password;

  if (!email || !password || !name) {
    return NextResponse.json(
      {
        error: "Name, email, or password are required.",
      },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      {
        error: "Password must be at least 8 characters.",
      },
      { status: 400 },
    );
  }

  const existingUser = await db.query(
    `select id from users
        where email = $1
        limit 1
    `,
    [email],
  );

  if (!existingUser.rowCount) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const password_hash = await bcrypt.hash(password, 12);
  const result = await db.query(
    `
    insert into users (name, email, password_hash, provider)
    values ($1, $2, $3, 'credentials')
    returning id, email, name
    `,
    [name || null, email, password_hash],
  );

  return NextResponse.json({
    user: result.rows[0],
  });
}
