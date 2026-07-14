import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

const PREMIUM_PLANS = [
  {
    id: "monthly",
    name: "Monthly Premium",
    price: 4.99,
    durationDays: 30,
    features: [
      "Unlimited downloads",
      "4K quality wallpapers",
      "Early access (24-48h)",
      "No ads",
      "Premium badge",
    ],
  },
  {
    id: "yearly",
    name: "Yearly Premium",
    price: 39.99,
    durationDays: 365,
    features: [
      "Everything in Monthly",
      "Save 33% vs monthly",
      "Exclusive wallpapers",
      "Priority support",
      "Custom collections",
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: PREMIUM_PLANS,
  });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id;
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { planId } = await request.json();

    const plan = PREMIUM_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ success: false, message: "Invalid plan" }, { status: 400 });
    }

    // Check if user is already premium
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.isPremium && user.premiumExpiry && new Date(user.premiumExpiry) > new Date()) {
      return NextResponse.json(
        { success: false, message: "You already have an active premium subscription" },
        { status: 400 }
      );
    }

    // In a real app, this would integrate with Stripe/PayPal
    // For demo purposes, we'll simulate a successful payment
    const premiumExpiry = new Date();
    premiumExpiry.setDate(premiumExpiry.getDate() + plan.durationDays);

    await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumExpiry,
      },
    });

    // Create payment record (demo)
    // In production, this would be created after payment webhook confirmation
    console.log(`[DEMO] Payment processed: User ${userId} purchased ${plan.name} for $${plan.price}`);

    return NextResponse.json({
      success: true,
      message: `Premium activated! Your subscription is valid until ${premiumExpiry.toLocaleDateString()}`,
      data: {
        plan: plan.name,
        expiresAt: premiumExpiry,
      },
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { success: false, message: "Payment processing failed" },
      { status: 500 }
    );
  }
}
