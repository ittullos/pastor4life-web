import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — Pastor4Life",
  description: "Terms of Use for the Pastor4Life mobile application.",
};

// Content is verbatim from WEBSITE_PROJECT_CHECKLIST.md Section 8.3 — do not
// rewrite the legal text. "Last Updated" intentionally left at the source
// date; bump it to the real publish date at Phase 8 cutover, not before.
export default function Terms() {
  return (
    <article className="prose prose-neutral mx-auto max-w-3xl px-6 py-16 prose-headings:text-brand-navy prose-a:text-brand-navy sm:py-20">
      <h1>Terms of Use</h1>
      <p className="text-sm text-brand-navy/60">Last Updated: June 18, 2026</p>

      <p>
        Welcome to Pastor4Life. These Terms of Use (&ldquo;Terms&rdquo;)
        govern your use of the Pastor4Life mobile application (the
        &ldquo;App&rdquo;) operated by Pastor4Life (&ldquo;we&rdquo;,
        &ldquo;our&rdquo;, or &ldquo;us&rdquo;). By using the App, you agree
        to be bound by these Terms and our Privacy Policy. If you do not
        agree with these Terms, please do not use the App.
      </p>

      <h2>1. Use of the App</h2>
      <p>
        The Pastor4Life App is designed to support your personal spiritual
        journey through features like prayer focus content, route
        journaling, and devotional playback. You agree to use the App only
        for lawful purposes and in a way that does not infringe the rights
        of others or restrict their use and enjoyment of the App.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 13 years old to use the App. By using the App,
        you affirm that you meet this requirement.
      </p>

      <h2>3. User-Generated Content</h2>
      <p>
        When you use the App, certain activity data — such as route duration
        and estimated mileage — is stored securely in our database to
        support your personalized experience across devices.
      </p>
      <p>
        You retain ownership of the data associated with your account. We do
        not share or distribute your personal activity data with third
        parties. We access and process your data solely for the purpose of
        providing the App&rsquo;s services to you.
      </p>

      <h2>4. Data Storage and Security</h2>
      <p>
        All user data, including route activities and account information,
        is stored securely using Amazon Web Services (AWS) infrastructure.
        AWS offers industry-standard encryption and data protection
        practices. For more information on how we handle your personal
        data, please refer to our Privacy Policy.
      </p>

      <h2>5. Account Management</h2>
      <p>
        You are responsible for maintaining the confidentiality of your
        login credentials. You agree to notify us immediately if you
        believe your account has been compromised.
      </p>
      <p>
        You may permanently delete your account and all associated data —
        including route history and commitment progress — at any time
        through the App&rsquo;s Settings screen. This action is immediate
        and cannot be undone.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All content, branding, and functionality of the App (except for
        user-submitted content) are the intellectual property of The
        Tennessee Baptist Mission Board and may not be copied, distributed,
        or modified without prior written consent.
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        The App is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; without warranties of any kind. We do not
        guarantee that the App will be uninterrupted, secure, or
        error-free.
      </p>
      <p>
        Pastor4Life is not responsible for any personal outcomes related to
        prayer, route tracking, or spiritual progress recorded in the App.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Pastor4Life shall not be
        liable for any indirect, incidental, special, or consequential
        damages resulting from your use of or inability to use the App.
      </p>

      <h2>9. Modifications to These Terms</h2>
      <p>
        We may update these Terms from time to time. The updated Terms will
        be effective upon posting. Continued use of the App after changes
        constitutes your acceptance of the updated Terms.
      </p>

      <h2>10. Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us:</p>
      <p>
        Email: brainstorm.designs.co@gmail.com
        <br />
        Website: www.pastor4life.com
      </p>
    </article>
  );
}
