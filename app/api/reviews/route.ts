import prisma from "@/lib/db";
import { fail } from "@/lib/api";
import { Prisma } from "@/prisma/generated/prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { newReviewSchema } from "@/schemas/new-review";
import { storeUploadcareFile } from "@/lib/uploadcare";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { success, error, data } = newReviewSchema.safeParse(body);

  if (!success) {
    return fail(error.issues[0].message, 400);
  }

  const { id, message, customerName, customerEmail, customerImage, rating } =
    data;

  try {
    await prisma.review.create({
      data: {
        message,
        customerName,
        customerEmail,
        customerImage,
        rating,
        product: {
          connect: {
            id,
          },
        },
      },
    });

    if (customerImage) {
      await storeUploadcareFile(customerImage);
    }

    return NextResponse.json(
      { message: "Review submitted", success: true },
      { status: 201 }
    );
  } catch (err) {
    // P2025: the product to connect is missing. P2003: it was deleted mid-insert.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      (err.code === "P2025" || err.code === "P2003")
    ) {
      return fail("Product not found", 404);
    }

    console.error("Error while creating a review: ", err);
    return fail("Internal server error", 500);
  }
}
