import { describe, expect, it } from "vitest";
import { updateProfileSchema } from "./update-profile";

const validProfile = {
  name: "Munadil",
  image:
    "https://ifkueqi105.ucarecd.net/0f7c2b5e-1d3a-4c8b-9e6f-2a4b6c8d0e1f/",
};

describe("updateProfileSchema", () => {
  it("accepts an empty image to clear the avatar", () => {
    expect(
      updateProfileSchema.safeParse({ ...validProfile, image: "" }).success
    ).toBe(true);
  });

  it("accepts a profile with no image key", () => {
    expect(updateProfileSchema.safeParse({ name: "Munadil" }).success).toBe(
      true
    );
  });

  it("rejects a blank name", () => {
    const result = updateProfileSchema.safeParse({ ...validProfile, name: " " });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Name is required");
  });

  it("rejects a name longer than 100 characters", () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      name: "a".repeat(101),
    });

    expect(result.success).toBe(false);
  });

  it("rejects an image that is not an Uploadcare URL", () => {
    for (const image of [
      "https://example.com/avatar.png",
      "not-a-url",
      "https://ifkueqi105.ucarecd.net/not-a-uuid/",
    ]) {
      const result = updateProfileSchema.safeParse({ ...validProfile, image });

      expect(result.success, image).toBe(false);
    }
  });
});
