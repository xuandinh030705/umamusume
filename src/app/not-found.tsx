import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">🏇</div>
        <h1 className="text-6xl font-bold text-[#D4A843] mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-[#666] mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="inline-flex items-center px-6 py-3 bg-[#D4A843] text-black font-semibold rounded-xl hover:bg-[#F5E6C8] transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
