import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/validators/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    const { email, password, name } = result.data;
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }
    const hashedPassword = await hash(password, 10);
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });
    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
