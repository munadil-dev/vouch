// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PATCH } from "./route";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { storeUploadcareFile } from "@/lib/uploadcare";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  default: { user: { update: vi.fn() } },
}));
vi.mock("@/lib/uploadcare", () => ({ storeUploadcareFile: vi.fn() }));

const mockAuth = vi.mocked(auth as () => Promise<unknown>);
const mockUpdate = vi.mocked(prisma.user.update);
const mockStore = vi.mocked(storeUploadcareFile);

const photoUrl =
  "https://ifkueqi105.ucarecd.net/0f7c2b5e-1d3a-4c8b-9e6f-2a4b6c8d0e1f/";

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/user", {
    method: "PATCH",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("PATCH /api/user", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 without a signed-in user id", async () => {
    for (const session of [null, { user: {} }]) {
      mockAuth.mockResolvedValue(session);

      const res = await PATCH(createRequest({ name: "Munadil" }));

      expect(res.status, JSON.stringify(session)).toBe(401);
    }
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 when the name is blank", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await PATCH(createRequest({ name: "   " }));

    expect(res.status).toBe(400);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 when the body is not valid JSON", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await PATCH(createRequest("{"));

    expect(res.status).toBe(400);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("stores the uploaded photo and returns the updated name", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdate.mockResolvedValue({ name: "Munadil" } as never);

    const res = await PATCH(
      createRequest({ name: "Munadil", image: photoUrl })
    );

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { name: "Munadil", image: photoUrl },
      select: { name: true },
    });
    expect(mockStore).toHaveBeenCalledWith(photoUrl);
    expect(await res.json()).toEqual({
      name: "Munadil",
      message: "Profile updated",
      success: true,
    });
  });

  it("clears the avatar to null and skips storing when image is empty", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdate.mockResolvedValue({ name: "Munadil" } as never);

    const res = await PATCH(createRequest({ name: "Munadil", image: "" }));

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { name: "Munadil", image: null } })
    );
    expect(mockStore).not.toHaveBeenCalled();
  });

  it("returns 500 when the update fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdate.mockRejectedValue(new Error("db down") as never);

    const res = await PATCH(createRequest({ name: "Munadil" }));

    expect(res.status).toBe(500);
  });
});
