import { NextResponse } from "next/server";

export function fail(message: string, status: number) {
  return NextResponse.json({ message, success: false }, { status });
}
