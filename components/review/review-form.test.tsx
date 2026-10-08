import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReviewForm from "./review-form";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const photoUrl =
  "https://ifkueqi105.ucarecd.net/0f7c2b5e-1d3a-4c8b-9e6f-2a4b6c8d0e1f/";
let uploadedUrl = photoUrl;

// Stands in for the Uploadcare uploader, which next/dynamic loads in the browser.
vi.mock("next/dynamic", () => ({
  default:
    () =>
    ({
      onFileUploadSuccess,
      onFileRemoved,
    }: {
      onFileUploadSuccess: (e: { cdnUrl: string; name: string }) => void;
      onFileRemoved: () => void;
    }) => (
      <>
        <button
          type="button"
          onClick={() =>
            onFileUploadSuccess({ cdnUrl: uploadedUrl, name: "jane.png" })
          }
        >
          Fake upload
        </button>

        <button type="button" onClick={onFileRemoved}>
          Fake remove
        </button>
      </>
    ),
}));

vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn(() => "toast-id"),
    dismiss: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const reply = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status });

const sentReview = () => JSON.parse(fetchMock.mock.calls[0][1].body);

const productDetails = {
  id: "product-1",
  title: "How was your experience?",
  message: "We read every message.",
};

function renderForm() {
  render(<ReviewForm productDetails={productDetails} />);
}

async function fillAndSubmit() {
  const user = userEvent.setup();

  await user.type(screen.getByRole("textbox", { name: "Message" }), "Loved it");
  await user.type(screen.getByRole("textbox", { name: "Your name" }), "Jane");
  await user.type(
    screen.getByRole("textbox", { name: "Your email" }),
    "jane@example.com"
  );
  await user.click(screen.getByRole("button", { name: "Rate 4 stars" }));
  await user.click(screen.getByRole("button", { name: "Submit review" }));
}

describe("ReviewForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uploadedUrl = photoUrl;
    fetchMock.mockImplementation(async () =>
      reply(201, { success: true, message: "Review submitted" })
    );
  });

  it("shows the product title and message", () => {
    renderForm();

    expect(
      screen.getByRole("heading", { name: productDetails.title })
    ).toBeInTheDocument();
    expect(screen.getByText(productDetails.message)).toBeInTheDocument();
  });

  it("labels the fields and marks which are required", () => {
    renderForm();

    expect(screen.getByRole("group", { name: "Rating" })).toBeInTheDocument();
    for (const name of ["Message", "Your name", "Your email"]) {
      expect(screen.getByRole("textbox", { name })).toBeRequired();
    }
    expect(screen.getByText("(optional)")).toBeInTheDocument();
  });

  it("submits the entered values with the selected rating", async () => {
    renderForm();

    await fillAndSubmit();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/reviews",
      expect.objectContaining({ method: "POST" })
    );
    expect(sentReview()).toEqual({
      id: "product-1",
      message: "Loved it",
      customerName: "Jane",
      customerEmail: "jane@example.com",
      customerImage: "",
      rating: 4,
    });
    expect(toast.success).toHaveBeenCalledWith("Review submitted");
    expect(push).toHaveBeenCalledWith("product-1/submitted");
  });

  it("shows the server's error message and stays on the page", async () => {
    fetchMock.mockImplementation(async () =>
      reply(400, { success: false, message: "Invalid email address" })
    );
    renderForm();

    await fillAndSubmit();

    expect(toast.error).toHaveBeenCalledWith("Invalid email address");
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Submit review" })).toBeEnabled();
  });

  it("shows inline errors and skips the request when fields are empty", async () => {
    renderForm();

    await userEvent.click(
      screen.getByRole("button", { name: "Submit review" })
    );

    expect(screen.getByText("Message is required")).toBeInTheDocument();
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("links each error to its field", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Message" }),
      "Loved it"
    );
    await user.type(screen.getByRole("textbox", { name: "Your name" }), "Jane");
    await user.type(
      screen.getByRole("textbox", { name: "Your email" }),
      "not-an-email"
    );
    await user.click(screen.getByRole("button", { name: "Submit review" }));

    const email = screen.getByRole("textbox", { name: "Your email" });

    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Invalid email address");
    expect(email).toHaveFocus();
    expect(
      screen.getByRole("textbox", { name: "Message" })
    ).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByText("Message is required")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("clears a field's error once the user edits it", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Submit review" }));
    await user.type(screen.getByRole("textbox", { name: "Your name" }), "J");

    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
  });

  it("shows a fallback error when the request fails without a response", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    renderForm();

    await fillAndSubmit();

    expect(toast.error).toHaveBeenCalledWith(
      "Could not send your review. Try again."
    );
    expect(push).not.toHaveBeenCalled();
  });

  it("submits the uploaded photo", async () => {
    renderForm();

    await userEvent.click(screen.getByRole("button", { name: "Fake upload" }));
    await fillAndSubmit();

    expect(screen.getByText("jane.png")).toBeInTheDocument();
    expect(sentReview()).toEqual(
      expect.objectContaining({ customerImage: photoUrl })
    );
  });

  it("drops the photo once the user removes it", async () => {
    renderForm();

    await userEvent.click(screen.getByRole("button", { name: "Fake upload" }));
    await userEvent.click(screen.getByRole("button", { name: "Fake remove" }));
    await fillAndSubmit();

    expect(screen.queryByText("jane.png")).not.toBeInTheDocument();
    expect(sentReview()).toEqual(
      expect.objectContaining({ customerImage: "" })
    );
  });

  it("shows a toast when the photo link is not from Uploadcare", async () => {
    uploadedUrl = "https://evil.example.com/jane.png";
    renderForm();

    await userEvent.click(screen.getByRole("button", { name: "Fake upload" }));
    await fillAndSubmit();

    expect(toast.error).toHaveBeenCalledWith("Upload the photo again");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
