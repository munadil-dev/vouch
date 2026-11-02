import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/lib/auth";
import { GoogleSVG } from "@/icons/Google";
import { Button } from "@/components/ui/button";
import SignInStory from "./sign-in-story";
import ThemeToggle from "@/components/layout/theme-toggle";
import skyImage from "@/public/sky.jpg";

export default function SignInComponent({ error }: { error?: string }) {
  return (
    <main className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      <section className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link
            className="font-instrument-serif text-foreground w-fit text-xl font-medium"
            href="/"
          >
            Vouch
          </Link>

          <ThemeToggle />
        </div>

        <form
          className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16"
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: "/dashboard",
            });
          }}
        >
          <h1 className="text-foreground text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-balance">
            Sign in to Vouch
          </h1>
          <p className="text-muted-foreground mt-3 text-[15px] leading-6">
            Free to use. Pick up where you left off, or create your first
            product in a minute.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
            >
              Sign in didn&apos;t work. Please try again.
            </p>
          )}

          <Button type="submit" variant="outline" className="mt-8 h-11 w-full">
            <GoogleSVG />
            Continue with Google
          </Button>
        </form>

        <p className="text-muted-foreground text-sm">
          New here?{" "}
          <Link
            href="/docs/quickstart"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Read the quickstart
          </Link>
        </p>
      </section>

      <Showcase />
    </main>
  );
}

function Showcase() {
  return (
    <figure className="relative isolate hidden flex-col justify-center overflow-hidden px-12 py-16 lg:flex">
      <Image
        src={skyImage}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="50vw"
        className="-z-20 object-cover dark:opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-black/15 dark:bg-black/45"
      />
      <figcaption className="mx-auto mb-10 max-w-sm text-center text-2xl leading-tight font-semibold tracking-[-0.03em] text-balance text-white drop-shadow-sm">
        Ask once. Show the best reviews on your site.
      </figcaption>
      <SignInStory />
    </figure>
  );
}
