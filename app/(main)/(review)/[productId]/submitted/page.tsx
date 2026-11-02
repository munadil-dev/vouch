import Link from "next/link";
import type { Metadata } from "next";
import SuccessIcon from "@/components/shared/success-icon";

export const metadata: Metadata = {
  title: "Review sent",
  robots: { index: false },
};

export default function ReviewSubmitted() {
  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-5 py-12">
      <section className="shadow-card-raised border-border bg-card w-full max-w-sm rounded-2xl border p-8 text-center">
        <SuccessIcon />
        <h1 className="text-foreground mt-4 text-xl font-semibold tracking-tight">
          Thanks for your review
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your response was sent. You can close this page.
        </p>

        <p className="text-muted-foreground mt-8 text-xs">
          Powered by{" "}
          <Link
            href={process.env.NEXT_PUBLIC_BASE_URL!}
            className="text-foreground font-medium hover:underline"
          >
            Vouch
          </Link>
        </p>
      </section>
    </main>
  );
}
