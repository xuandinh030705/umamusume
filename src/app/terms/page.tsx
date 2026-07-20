import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - UmaWall",
  description: "UmaWall terms of service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-2">
          Terms of <span className="gold-text">Service</span>
        </h1>
        <p className="text-[#666] mb-12">Last updated: January 2026</p>

        <div className="prose-dark space-y-8 text-[#999] text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using UmaWall, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. 
              You agree to provide accurate information during registration and to keep your account information up to date.
              You must be at least 13 years old to create an account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Content Upload</h2>
            <p>
              By uploading content to UmaWall, you represent that you have the right to share the content and that it does not 
              infringe on any third-party rights. You retain ownership of your uploads but grant UmaWall a license to display, 
              distribute, and serve the content through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Prohibited Content</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Content that is illegal, harmful, or violates any applicable laws</li>
              <li>Content that infringes on intellectual property rights</li>
              <li>Content containing malware, viruses, or malicious code</li>
              <li>Content that is sexually explicit or containsGraphic violence</li>
              <li>Spam, phishing, or fraudulent content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Intellectual Property</h2>
            <p>
              All wallpapers and content related to Umamusume Pretty Derby are the property of Cygames, Inc. 
              UmaWall is an unofficial fan site and does not claim ownership of any Cygames intellectual property. 
              The UmaWall platform, design, and code are owned by the UmaWall team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              UmaWall is provided "as is" without warranties of any kind. We are not liable for any damages 
              arising from the use of or inability to use the service. We reserve the right to modify or 
              discontinue the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our sole discretion, 
              without notice, for conduct that violates these terms or is otherwise harmful to the community.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Changes to Terms</h2>
            <p>
              We may revise these terms at any time. Continued use of the service after changes 
              constitutes acceptance of the revised terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
