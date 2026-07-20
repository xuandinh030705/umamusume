"use client";

import { useState } from "react";
import { Crown, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useSession } from "next-auth/react";

const features = [
  "Unlimited downloads per day",
  "Access to 4K/UHD wallpapers",
  "Early access to new content (24-48h)",
  "Ad-free experience",
  "Premium badge on comments",
  "Priority support",
];

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$4.99",
    period: "/month",
    popular: false,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$39.99",
    period: "/year",
    popular: true,
    savings: "Save 33%",
  },
];

export default function PremiumPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      window.location.href = "/auth/login?callbackUrl=/premium";
      return;
    }

    setLoading(planId);
    setMessage(null);

    try {
      const response = await fetch("/api/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        // Reload to update user state
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to process payment. Please try again." });
    } finally {
      setLoading(null);
    }
  };

  const isPremium =
    (session?.user as { isPremium?: boolean })?.isPremium;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Premium</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Upgrade to <span className="gold-text">Premium</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Get the ultimate UmaWall experience with unlimited downloads, exclusive 4K content,
            and early access to new wallpapers.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">
            What you get with <span className="gold-text">Premium</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border"
              >
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Choose your plan</h2>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-2xl text-center text-sm ${
                message.type === "success"
                  ? "bg-success/10 border border-success/30 text-success"
                  : "bg-destructive/10 border border-destructive/30 text-destructive"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative rounded-2xl border-border bg-card ${plan.popular ? "!border-primary" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-background text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <p className="text-sm text-success mb-4">{plan.savings}</p>
                  )}

                  {isPremium ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant={plan.popular ? "premium" : "outline"}
                      className="w-full"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading !== null}
                    >
                      {loading === plan.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {loading === plan.id ? "Processing..." : `Get ${plan.name}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo notice */}
          <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-sm text-primary">
              Demo Mode: Payments are simulated. Click any plan to activate Premium instantly.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. Your premium access will continue until the end of your billing period.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and other local payment methods.",
              },
              {
                q: "Is there a free trial?",
                a: "We offer a 7-day free trial for new premium members. No credit card required.",
              },
              {
                q: "What happens to my downloads if I downgrade?",
                a: "All wallpapers you've downloaded remain yours. Downgrading only affects future downloads and access to premium content.",
              },
            ].map((faq) => (
              <div key={faq.q} className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="font-medium mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground mb-6">
            Join thousands of UmaMusume fans who already have Premium
          </p>
          {!session && (
            <Link href="/auth/register">
              <Button size="lg" variant="premium">
                <Crown className="h-5 w-5 mr-2" />
                Get Started Today
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
