import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import { siteLinks } from "@/lib/constant/site.constant";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules for using Vouch.",
};

export default function Terms() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <article className="prose">
          <h1>Terms of Service</h1>
          <p>Last updated: October 4, 2026</p>

          <p>
            These terms cover your use of Vouch. By using it, you agree to them.
            If you don&apos;t agree, please don&apos;t use it.
          </p>

          <h2>The service</h2>
          <p>
            Vouch lets you collect reviews with a link and show the ones you
            pick on your website. It is free. The code is open source under the{" "}
            <Link href={siteLinks.github}>MIT license</Link>, which covers the
            code, not this hosted service.
          </p>

          <h2>Your account</h2>
          <p>
            You sign in with a third-party account, and you are responsible for
            what happens under your account.
          </p>

          <h2>Your content</h2>
          <p>
            You own the products you create and the reviews you collect. You
            give Vouch permission to store and show them so the service works.
            If you put reviews on your website, you are responsible for having
            the right to show them.
          </p>

          <h2>What you can&apos;t do</h2>
          <ul>
            <li>Post fake reviews or pay for reviews.</li>
            <li>Send spam or use Vouch to harass anyone.</li>
            <li>
              Upload illegal content, or content you don&apos;t have the right
              to share.
            </li>
            <li>Break, overload or get around the security of the service.</li>
          </ul>
          <p>We may remove content or close accounts that break these rules.</p>

          <h2>No warranty</h2>
          <p>
            Vouch is provided &quot;as is&quot;, without any warranty. It may
            change, go down or lose data, so keep your own copy of anything
            important.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            As far as the law allows, we are not liable for any indirect or
            consequential loss, or for lost data, profits or business, that
            comes from using Vouch.
          </p>

          <h2>Ending</h2>
          <p>
            You can stop using Vouch at any time and delete your products from
            the dashboard. We may stop offering Vouch, with notice on the site
            where possible.
          </p>

          <h2>Changes</h2>
          <p>
            If these terms change, the date at the top changes too. Using Vouch
            after a change means you accept the new terms.
          </p>

          <h2>Contact</h2>
          <p>
            Message <Link href={siteLinks.x}>@munadil_xd on X</Link>. See also
            the <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </article>
      </main>

      <Footer />
    </>
  );
}
