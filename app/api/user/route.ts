import prisma from "@/lib/db";
import { fail } from "@/lib/api";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";
import { updateProfileSchema } from "@/schemas/update-profile";
import { storeUploadcareFile } from "@/lib/uploadcare";

export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return fail("Unauthenticated", 401);
  }

  const body = await req.json().catch(() => null);
  const { success, error, data } = updateProfileSchema.safeParse(body);

  if (!success) {
    return fail(error.issues[0].message, 400);
  }

  const image = data.image === "" ? null : data.image;

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: data.name, image },
      select: { name: true },
    });

    if (image) {
      await storeUploadcareFile(image);
    }

    return NextResponse.json(
      { name: user.name, message: "Profile updated", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error while updating profile: ", err);
    return fail("Internal server error", 500);
  }
}
