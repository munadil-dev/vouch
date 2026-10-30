import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfileForm from "./profile-form";

const refresh = vi.fn();
const request = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("@/lib/request", () => ({
  request: (...args: unknown[]) => request(...args),
  errorMessage: (_err: unknown, fallback: string) => fallback,
}));

vi.mock("next/dynamic", () => ({
  default: () => () => <button type="button">Fake upload</button>,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const googleAvatar = "https://lh3.googleusercontent.com/a/avatar-s96-c";

describe("ProfileForm", () => {
  beforeEach(() => {
    request.mockReset();
    refresh.mockReset();
  });

  it("clears an avatar that was not uploaded in this session", async () => {
    request.mockResolvedValue({ message: "Profile updated" });
    const user = userEvent.setup();

    render(<ProfileForm user={{ name: "Munadil", image: googleAvatar }} />);

    await user.click(screen.getByRole("button", { name: "Remove photo" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(request).toHaveBeenCalledWith("/api/user", "PATCH", {
      name: "Munadil",
      image: "",
    });
  });

  it("offers no remove control to a user who has no avatar", () => {
    render(<ProfileForm user={{ name: "Munadil", image: "" }} />);

    expect(
      screen.queryByRole("button", { name: "Remove photo" })
    ).not.toBeInTheDocument();
  });
});
