import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import { siteLinks } from "@/lib/constant/site.constant";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Vouch collects, why, and how to get it removed.",
};

export default function Privacy() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <article className="prose">
          <h1>Privacy Policy</h1>
          <p>Last updated: October 4, 2026</p>

          <p>
            This page explains what we collect when you use Vouch, why, and who
            else handles it. Vouch is free and has no ads, and we never sell
            your data.
          </p>

          <h2>What we collect</h2>

          <h3>If you sign in</h3>
          <ul>
            <li>
              Basic account details, like your name, email address and profile
              picture.
            </li>
            <li>The content you create, like your products.</li>
          </ul>

          <h3>If you leave a review</h3>
          <ul>
            <li>
              The details you enter, like your name, email, review and photo.
            </li>
            <li>
              The product owner can see your review, and may show it on their
              website. Your email is never shown publicly.
            </li>
          </ul>

          <h2>Usage data and cookies</h2>
          <p>
            We collect anonymous usage data, like page views, to improve Vouch.
            We use cookies and similar technologies only to keep you signed in
            and make Vouch work, never for advertising.
          </p>

          <h2>Who else handles your data</h2>
          <p>
            We use trusted third-party services for hosting, storage, file
            uploads, sign in and analytics. They process data only to provide
            their service to us.
          </p>

          <h2>Product owners and their customers</h2>
          <p>
            Product owners decide which reviews to collect and show, so they are
            responsible for the reviews they collect. Vouch stores those reviews
            for them. If you left a review and want it removed, ask the product
            owner first, or contact us below.
          </p>

          <h2>Keeping and deleting data</h2>
          <p>
            We keep your data until it is deleted. You can delete your content
            at any time from the dashboard. To delete your account, contact us
            and we will remove it.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask to see, correct or delete your personal data. We will
            reply as soon as we can.
          </p>

          <h2>Changes</h2>
          <p>
            If this policy changes, the date at the top changes too. Big changes
            will also be announced on the site.
          </p>

          <h2>Contact</h2>
          <p>
            Message <Link href={siteLinks.x}>@munadil_xd on X</Link>. See also
            the <Link href="/terms">Terms of Service</Link>.
          </p>
        </article>
      </main>

      <Footer />
    </>
  );
}
