"use client";

import { toast } from "sonner";
import { errorMessage, request } from "@/lib/request";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, MoreHorizontal, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "@/components/shared/delete-dialog";
import EditProductDialog from "@/components/product/edit-product-dialog";
import { formatRating } from "@/lib/review-stats";

interface ProductCardProps {
  id: string;
  name: string;
  title: string;
  message: string;
  responses: number;
  averageRating: number;
  favorites: number;
  latestMessage?: string;
}

export default function ProductCard({
  details: {
    id,
    name,
    title,
    message,
    responses,
    averageRating,
    favorites,
    latestMessage,
  },
}: {
  details: ProductCardProps;
}) {
  const router = useRouter();
  const href = `/dashboard/product/${id}`;
  const [product, setProduct] = useState({ name, title, message });
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <article className="group shadow-card hover:shadow-card-raised border-border bg-card hover:border-muted-foreground/40 relative flex h-full flex-col rounded-2xl border p-5 transition-[border-color,box-shadow] duration-150">
      <header className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="bg-foreground text-background flex size-9 items-center justify-center rounded-lg text-sm font-semibold uppercase"
        >
          {[...product.name][0]}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger
            ref={menuTriggerRef}
            aria-label={`Actions for ${product.name}`}
            className="focus-visible:ring-primary text-muted-foreground hover:bg-accent hover:text-foreground relative z-10 -mt-1 -mr-1 flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(href)}
            >
              View
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setEditOpen(true)}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <EditProductDialog
          productId={id}
          values={product}
          onSaved={setProduct}
          open={editOpen}
          onOpenChange={setEditOpen}
          returnFocusRef={menuTriggerRef}
        />

        <DeleteAlert
          productId={id}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          returnFocusRef={menuTriggerRef}
        />
      </header>

      <Link
        href={href}
        className="focus-visible:after:ring-primary text-foreground mt-5 rounded-sm font-semibold tracking-tight wrap-anywhere after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-hidden focus-visible:after:ring-2"
      >
        {product.name}
      </Link>

      <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm tabular-nums">
        {responses} {responses === 1 ? "response" : "responses"}
        {responses > 0 && (
          <>
            <span aria-hidden="true">·</span>

            <Star
              aria-hidden="true"
              className="size-3.5 fill-amber-400 text-amber-400"
            />

            <span>
              {formatRating(averageRating)}
              <span className="sr-only"> average rating</span>
            </span>
          </>
        )}
      </p>

      <p className="text-muted-foreground mt-4 line-clamp-2 flex-1 text-sm leading-6">
        {latestMessage
          ? `“${latestMessage}”`
          : "No reviews yet. Share your link to get the first one."}
      </p>

      <footer className="border-border text-muted-foreground mt-5 flex items-center justify-between border-t pt-3 text-xs tabular-nums">
        <span>
          {favorites} {favorites === 1 ? "favorite" : "favorites"}
        </span>

        <ChevronRight
          aria-hidden="true"
          className="text-muted-foreground size-4 transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </footer>
    </article>
  );
}

function DeleteAlert({
  productId,
  open,
  onOpenChange,
  returnFocusRef,
}: {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const toastId = toast.loading("Product getting deleted...");

    try {
      const data = await request(`/api/product/${productId}`, "DELETE");

      toast.dismiss(toastId);
      toast.success(data.message);
      router.refresh();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(
        errorMessage(err, "Could not delete the product. Try again.")
      );
    }
  };

  return (
    <DeleteDialog
      description="This action cannot be undone. This will permanently delete your product and remove the data from our servers."
      onConfirm={handleDelete}
      open={open}
      onOpenChange={onOpenChange}
      returnFocusRef={returnFocusRef}
    />
  );
}
