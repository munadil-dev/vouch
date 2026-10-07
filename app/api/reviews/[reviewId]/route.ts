import prisma from "@/lib/db";
import { fail } from "@/lib/api";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

type Context = { params: Promise<{ reviewId: string }> };

export async function PATCH(req: NextRequest, { params }: Context) {
  const session = await auth();

  if (!session?.user?.id) {
    return fail("Unauthenticated", 401);
  }

  const { reviewId } = await params;
  const body = await req.json().catch(() => null);

  if (typeof body?.isFavorite !== "boolean") {
    return fail("isFavorite must be a boolean", 400);
  }

  try {
    const { count } = await prisma.review.updateMany({
      where: {
        id: reviewId,
        product: { userId: session.user.id },
      },
      data: {
        isFavorite: body.isFavorite,
      },
    });

    if (count === 0) {
      return fail("Review not found", 404);
    }

    return NextResponse.json({
      message: body.isFavorite ? "Added to favorite" : "Removed from favorite",
      success: true,
    });
  } catch (err) {
    console.error("Error while favoriting a review: ", err);
    return fail("Internal server error", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const session = await auth();

  if (!session?.user?.id) {
    return fail("Unauthenticated", 401);
  }

  const { reviewId } = await params;

  try {
    const { count } = await prisma.review.deleteMany({
      where: {
        id: reviewId,
        product: { userId: session.user.id },
      },
    });

    if (count === 0) {
      return fail("Review not found", 404);
    }

    return NextResponse.json({
      message: "Review deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error while deleting a review: ", err);
    return fail("Internal server error", 500);
  }
}
