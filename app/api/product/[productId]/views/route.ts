import prisma from "@/lib/db";
import { fail } from "@/lib/api";
import { Prisma } from "@/prisma/generated/prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { toDay } from "@/lib/analytics";

type Context = { params: Promise<{ productId: string }> };

export async function POST(_req: NextRequest, { params }: Context) {
  const { productId } = await params;
  const date = new Date(toDay(new Date()));

  try {
    await prisma.productView.upsert({
      where: { productId_date: { productId, date } },
      create: { productId, date },
      update: { count: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    // P2003: the product is missing, so the new row's foreign key fails.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2003"
    ) {
      return fail("Product not found", 404);
    }

    console.error("Error while counting a product view: ", err);
    return fail("Internal server error", 500);
  }
}
