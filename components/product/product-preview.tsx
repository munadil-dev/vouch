import Image from "next/image";
import { Fragment } from "react";
import { Upload } from "lucide-react";
import { Control, useWatch } from "react-hook-form";
import type { NewProductType } from "@/schemas/new-product";
import { previewFields } from "@/lib/constant/product.constant";
import skyImage from "@/public/sky.jpg";
import { Label } from "@/components/ui/label";
import { Stars } from "@/components/home/stars";
import { WindowDots } from "@/components/home/window-dots";

export default function ProductPreview({
  control,
}: {
  control: Control<NewProductType>;
}) {
  const [title, message] = useWatch({ control, name: ["title", "message"] });

  return (
    <section
      aria-label="Preview"
      className="relative isolate overflow-hidden rounded-3xl px-4 py-8 shadow-[0_40px_80px_-40px_rgba(31,62,181,0.55)] sm:px-10 sm:py-12 lg:sticky lg:top-20"
    >
      <Image
        src={skyImage}
        alt=""
        fill
        placeholder="blur"
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="-z-20 object-cover dark:opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-black/10 dark:bg-black/45"
      />

      <p className="text-center text-sm font-medium text-white/90">
        Live preview of what customers see
      </p>

      <div className="bg-card dark:border-border mx-auto mt-5 max-w-md overflow-hidden rounded-xl border border-white/60 shadow-[0_1px_2px_rgba(20,30,90,0.2),0_32px_64px_-24px_rgba(20,30,90,0.6)]">
        <div className="border-border flex items-center gap-3 border-b px-4 py-2.5">
          <WindowDots />
          <span className="text-muted-foreground text-xs">
            vouch.munadil.com
          </span>
        </div>

        <div aria-hidden="true" className="bg-muted flex flex-col gap-3 p-6">
          <p className="text-foreground text-center text-xl font-semibold tracking-tight wrap-anywhere">
            {title || "Your page title"}
          </p>

          <p className="text-muted-foreground mb-2 text-center text-sm wrap-anywhere">
            {message || "Your message to customers"}
          </p>

          {previewFields.map(({ label, height }) => (
            <Fragment key={label}>
              <Label>{label}</Label>

              <div
                className={`${height} border-border bg-popover rounded-md border`}
              />
            </Fragment>
          ))}

          <Label>Upload your photo</Label>

          <div className="bg-foreground text-background flex h-8 w-fit items-center gap-2 rounded-md px-3 text-sm">
            <Upload className="size-4" />
            Upload file
          </div>

          <Label>Rate</Label>

          <Stars count={5} />

          <div className="bg-primary text-primary-foreground mt-2 flex h-10 items-center justify-center rounded-lg text-sm font-medium">
            Submit review
          </div>
        </div>
      </div>
    </section>
  );
}
