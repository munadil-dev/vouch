"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import SuccessIcon from "@/components/shared/success-icon";
import { useCopy } from "@/components/home/interactive";

export default function ProductCreated({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}${id}`;
  const [copied, copyLink] = useCopy(link);

  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-5 py-12">
      <section className="shadow-card-raised w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-center">
        <SuccessIcon />

        <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950">
          {name} is ready
        </h1>

        <p className="mt-1 text-sm text-zinc-600">
          Send this link to customers to collect reviews.
        </p>

        <p className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-[13px] break-all text-zinc-700">
          {link}
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={copyLink}>
            {copied ? "Copied!" : "Copy link"}
          </Button>

          <Link href="/dashboard" className={buttonVariants()}>
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
