"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Avatar } from "@/components/home/avatar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfileDropdownProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const showImage = Boolean(user.image) && user.image !== failedSrc;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        aria-label="Open account menu"
        className="cursor-pointer rounded-full select-none"
        render={
          <span className="flex items-center justify-center">
            {showImage ? (
              <Image
                src={user.image!}
                onError={() => setFailedSrc(user.image ?? null)}
                className="rounded-full select-none"
                width={33}
                height={33}
                alt="profile image"
              />
            ) : (
              <Avatar name={user.name ?? "?"} size="sm" decorative={false} />
            )}
          </span>
        }
      />

      <DropdownMenuContent align="end" className="mt-1">
        <DropdownMenuItem
          className="sm:hidden"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
