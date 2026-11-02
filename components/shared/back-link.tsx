import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackLink() {
  return (
    <Link
      href="/dashboard"
      className="focus-visible:ring-primary text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
    >
      <ArrowLeft className="size-4" />
      Products
    </Link>
  );
}
