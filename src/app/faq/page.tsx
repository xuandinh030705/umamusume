import { Metadata } from "next";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ - UmaWall",
  description: "Frequently asked questions about UmaWall.",
};

const faqs = [
  {
    q: "What is UmaWall?",
    a: "UmaWall is a community-driven wallpaper gallery dedicated to Umamusume Pretty Derby. Browse, download, and share high-quality wallpapers of your favorite characters.",
  },
  {
    q: "Is UmaWall free to use?",
    a: "Yes! UmaWall is completely free. Some wallpapers may be marked as premium and require a free account to download, but there are no paid subscriptions.",
  },
  {
    q: "How do I upload wallpapers?",
    a: "Create a free account, then navigate to the Upload page. You can upload wallpapers in JPG, PNG, or WebP format. All uploads go through a review process before being published.",
  },
  {
    q: "What wallpaper sizes are available?",
    a: "We support wallpapers for all devices: Desktop (16:9, 21:9), Mobile (9:16), and Tablet (4:3). Upload your wallpaper in the original resolution and we'll handle the rest.",
  },
  {
    q: "Can I request a specific wallpaper?",
    a: "Yes! Visit the Requests page to submit a wallpaper request. Other users can upvote requests to help prioritize them.",
  },
  {
    q: "How do I report inappropriate content?",
    a: "Click the report button on any wallpaper or comment. Our moderators will review the report and take appropriate action.",
  },
  {
    q: "Can I create collections?",
    a: "Yes! Registered users can create public or private collections to organize their favorite wallpapers. Add any wallpaper to a collection from its detail page.",
  },
  {
    q: "Who owns the wallpapers?",
    a: "All wallpapers are uploaded by community members. UmaWall does not claim ownership of any content. If you are a rights holder and wish to have content removed, please contact us.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-2">
          Frequently Asked <span className="gold-text">Questions</span>
        </h1>
        <p className="text-[#666] text-lg mb-12">
          Everything you need to know about UmaWall.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group border border-[#222] rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#111] transition-colors">
                <span className="font-medium pr-4">{faq.q}</span>
                <ChevronDown className="h-5 w-5 text-[#666] shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 text-sm text-[#999] leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
