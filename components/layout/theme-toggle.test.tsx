import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "@/components/ui/sonner";
import ThemeToggle from "./theme-toggle";

const setTheme = vi.fn();
const themeState = {
  theme: "dark",
  resolvedTheme: "dark",
  setTheme,
};

vi.mock("next-themes", () => ({
  useTheme: () => themeState,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("sonner", () => ({
  Toaster: ({ theme }: { theme?: string }) => (
    <div data-testid="sonner" data-theme={theme} />
  ),
}));

// Base UI portals need layout APIs that jsdom does not provide, so the menu is
// flattened for this test. The toggle's wiring is what matters here.
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({
    children,
    ...props
  }: React.ComponentProps<"button">) => <button {...props}>{children}</button>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }: React.ComponentProps<"button">) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    setTheme.mockReset();
    themeState.theme = "dark";
    themeState.resolvedTheme = "dark";
  });

  it("switches the theme and passes the resolved theme to Sonner", async () => {
    const user = userEvent.setup();

    render(
      <>
        <ThemeToggle />
        <Toaster />
      </>
    );

    expect(screen.getByTestId("sonner")).toHaveAttribute("data-theme", "dark");
    expect(
      screen.getByRole("button", { name: "Change theme" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Light" }));

    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
