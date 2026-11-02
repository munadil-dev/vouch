"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import * as motion from "motion/react-client";
import { ease } from "@/lib/constant/ui.constant";
import {
  demoResponses,
  initialFavorites,
} from "@/lib/constant/hero-demo.constant";
import { Avatar } from "./avatar";
import { HeartButton } from "./interactive";
import { Stars } from "./stars";
import { WindowDots } from "./window-dots";

export default function HeroDemo() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const shown = demoResponses.filter((response) =>
    favorites.includes(response.id)
  );

  const toggle = (id: string) =>
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favorite) => favorite !== id)
        : [...current, id]
    );

  return (
    <MotionConfig reducedMotion="user">
      <div className="border-border bg-card grid overflow-hidden rounded-xl border shadow-[0_1px_2px_rgba(20,30,90,0.2),0_32px_64px_-24px_rgba(20,30,90,0.6)] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_32px_64px_-24px_rgba(0,0,0,0.8)]">
        <section
          aria-label="Your dashboard"
          className="border-border border-b md:border-r md:border-b-0"
        >
          <header className="border-border flex items-baseline justify-between border-b px-5 py-4">
            <p className="text-foreground text-sm font-semibold">
              Acme reviews
            </p>
            <p className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium tabular-nums">
              {favorites.length} of {demoResponses.length} on your site
            </p>
          </header>

          <ul className="divide-border divide-y">
            {demoResponses.map((response) => (
              <li
                key={response.id}
                className="flex items-start gap-3 px-5 py-3.5"
              >
                <Avatar name={response.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground truncate text-sm font-medium">
                      {response.name}
                    </p>
                    <Stars count={response.rating} size="sm" />
                  </div>
                  <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">
                    {response.message}
                  </p>
                </div>
                <HeartButton
                  pressed={favorites.includes(response.id)}
                  onToggle={() => toggle(response.id)}
                  label={`Show ${response.name}'s review on your site`}
                  className="-m-1.5"
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Your website" className="bg-muted">
          <header className="border-border bg-card flex items-center gap-3 border-b px-5 py-4">
            <WindowDots />
            <p className="text-muted-foreground text-xs">acme.app</p>
          </header>

          <div className="px-5 py-6 sm:px-8">
            <p className="text-foreground text-lg font-semibold tracking-tight">
              What customers say about Acme
            </p>

            <ul className="mt-5 flex flex-wrap gap-3" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((response) => (
                  <motion.li
                    key={response.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      scale: 0.96,
                      transition: { duration: 0.15, ease },
                    }}
                    transition={{ duration: 0.25, ease }}
                    className="shadow-card border-border bg-card flex w-full flex-col gap-3 rounded-[7px] border p-3 sm:w-[calc(50%-6px)]"
                  >
                    <Stars count={response.rating} size="sm" />
                    <blockquote className="text-muted-foreground text-sm">
                      {response.message}
                    </blockquote>
                    <div className="flex items-center gap-2">
                      <Avatar name={response.name} />
                      <p className="text-foreground text-sm font-semibold">
                        {response.name}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {shown.length === 0 && (
              <p className="border-border text-muted-foreground rounded-[7px] border border-dashed p-6 text-center text-sm">
                Favorite a response to show it here.
              </p>
            )}
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
