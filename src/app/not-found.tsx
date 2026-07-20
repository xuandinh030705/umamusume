import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="text-center relative animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-8xl font-bold gold-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-light transition-all duration-300 shadow-lg shadow-primary/25"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
