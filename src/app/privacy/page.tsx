import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - UmaWall",
  description: "UmaWall privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-2">
          Privacy <span className="gold-text">Policy</span>
        </h1>
        <p className="text-[#666] mb-12">Last updated: January 2026</p>

        <div className="prose-dark space-y-8 text-[#999] text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you create an account, we collect your name, email address, and profile image (if provided via Google OAuth). 
              We also collect usage data such as pages visited, wallpapers viewed, and downloads for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To provide and maintain the UmaWall service</li>
              <li>To personalize your experience and save your preferences</li>
              <li>To track downloads and manage your collections</li>
              <li>To improve our service through analytics</li>
              <li>To communicate with you about your account or service updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Data Storage</h2>
            <p>
              Your data is stored securely on our servers. We use industry-standard encryption for data in transit (HTTPS) 
              and at rest. Profile images are stored via Cloudinary's secure cloud infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Third-Party Services</h2>
            <p>
              We use the following third-party services: Google OAuth for authentication, Cloudinary for image storage, 
              and Vercel for hosting. Each service has its own privacy policy governing data collection and usage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. No tracking or advertising cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. You may delete your account at any time, 
              which will remove your personal data. Uploaded wallpapers may be retained for community benefit unless specifically 
              requested for removal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. Contact us at support@umawall.com 
              to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
