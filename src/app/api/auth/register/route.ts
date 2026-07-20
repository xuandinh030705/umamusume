import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { authLimiter, createRateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rl = authLimiter(request);
  if (!rl.allowed) return createRateLimitResponse(rl.resetTime);

  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name: trimmedName, email: trimmedEmail, password: hashedPassword },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created",
        data: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
