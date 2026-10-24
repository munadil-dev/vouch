import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import BackLink from "@/components/shared/back-link";
import ProfileForm from "@/components/user/profile-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, image: true },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <BackLink />

      <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-zinc-950">
        Account settings
      </h1>

      <p className="mt-3 text-[15px] leading-6 text-zinc-600">
        Update how you appear across your dashboard and public pages.
      </p>

      <div className="mt-8 max-w-lg">
        <ProfileForm user={{ name: user.name ?? "", image: user.image ?? "" }} />
      </div>
    </main>
  );
}
