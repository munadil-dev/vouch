import prisma from "@/lib/db";
import { fail } from "@/lib/api";
import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";
import { newProductSchema } from "@/schemas/new-product";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return fail("Unauthenticated", 401);
  }

  const body = await req.json().catch(() => null);
  const { success, error, data } = newProductSchema.safeParse(body);

  if (!success) {
    return fail(error.issues[0].message, 400);
  }

  const { name, title, message } = data;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        title,
        message,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
      select: { id: true },
    });

    return NextResponse.json(
      { id: product.id, message: "Product created", success: true },
      { status: 201 }
    );
  } catch (err) {
    console.log("Error while creating a new product: ", err);
    return fail("Internal server error", 500);
  }
}
