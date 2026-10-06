import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import StarRating from "./star-rating";

function renderRating(value = 5) {
  const onChange = vi.fn();

  render(<StarRating value={value} onChange={onChange} />);

  return onChange;
}

const star = (name: string) => screen.getByRole("button", { name });

describe("StarRating", () => {
  it("renders five labelled star buttons in a rating group", () => {
    renderRating();

    const group = screen.getByRole("group", { name: "Rating" });

    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(star("Rate 1 star")).toBeInTheDocument();
    expect(star("Rate 5 stars")).toBeInTheDocument();
  });

  it("marks only the selected star as pressed", () => {
    renderRating(3);

    expect(star("Rate 3 stars")).toHaveAttribute("aria-pressed", "true");
    expect(star("Rate 5 stars")).toHaveAttribute("aria-pressed", "false");
    expect(star("Rate 1 star")).toHaveAttribute("aria-pressed", "false");
  });

  it("reports the clicked star", async () => {
    const onChange = renderRating(3);

    await userEvent.click(star("Rate 5 stars"));

    expect(onChange).toHaveBeenLastCalledWith(5);

    await userEvent.click(star("Rate 1 star"));

    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it("can be rated with the keyboard", async () => {
    const user = userEvent.setup();
    const onChange = renderRating();

    await user.tab();
    await user.tab();
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenLastCalledWith(2);

    await user.tab();
    await user.tab();
    await user.keyboard(" ");

    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it("does not submit the surrounding form", async () => {
    const onSubmit = vi.fn((e) => e.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <StarRating value={5} onChange={vi.fn()} />
      </form>
    );

    await userEvent.click(star("Rate 4 stars"));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
