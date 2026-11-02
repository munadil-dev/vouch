"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // The public review form is for customers, so it never shows the switcher.
  const segments = pathname.split("/").filter(Boolean);
  const isPublicReview =
    (segments.length === 1 &&
      !["docs", "terms", "privacy", "dashboard", "auth"].includes(
        segments[0]
      )) ||
    (segments.length === 2 && segments[1] === "submitted");

  if (isPublicReview) return null;

  const current = mounted ? theme : undefined;
  const TriggerIcon = mounted && resolvedTheme === "dark" ? Moon : Sun;

  const changeTheme = (value: (typeof themes)[number]["value"]) => {
    const doc = document as ViewTransitionDocument;

    if (
      !doc.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(value);
      return;
    }

    doc.startViewTransition(() => {
      flushSync(() => setTheme(value));
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change theme"
        className={cn(
          "text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-primary flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-hidden",
          className
        )}
      >
        <TriggerIcon className="size-4.5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        {themes.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => changeTheme(value)}
            className="cursor-pointer gap-2"
          >
            <Icon className="text-muted-foreground size-4" />
            <span className="flex-1">{label}</span>
            {current === value && <Check className="text-primary size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
