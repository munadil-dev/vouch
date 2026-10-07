import prisma from "@/lib/db";
import { fail } from "@/lib/api";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";
import { newProductSchema } from "@/schemas/new-product";

type Context = { params: Promise<{ productId: string }> };

export async function PATCH(req: NextRequest, { params }: Context) {
  const session = await auth();

  if (!session?.user?.id) {
    return fail("Unauthenticated", 401);
  }

  const { productId } = await params;
  const body = await req.json().catch(() => null);
  const { success, error, data } = newProductSchema.safeParse(body);

  if (!success) {
    return fail(error.issues[0].message, 400);
  }

  const { name, title, message } = data;

  try {
    const { count } = await prisma.product.updateMany({
      where: { id: productId, userId: session.user.id },
      data: { name, title, message },
    });

    if (count === 0) {
      return fail("Product not found", 404);
    }

    return NextResponse.json({ message: "Product updated", success: true });
  } catch (err) {
    console.log("Error while updating a product: ", err);
    return fail("Internal server error", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const session = await auth();

  if (!session?.user?.id) {
    return fail("Unauthenticated", 401);
  }

  const { productId } = await params;

  try {
    const { count } = await prisma.product.deleteMany({
      where: { id: productId, userId: session.user.id },
    });

    if (count === 0) {
      return fail("Product not found", 404);
    }

    return NextResponse.json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (err) {
    console.log("Error while deleting a product: ", err);
    return fail("Internal server error", 500);
  }
}
