import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { error } from "console";

export async function POST(request: Request) {
  const body = await request.json();
  const name = body.name?.trim();
  const email = body.email?.toLowerCase().trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      {
        error: "Email and password are required.",
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
}
