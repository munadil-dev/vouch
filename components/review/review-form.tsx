"use client";

import { errorMessage, request } from "@/lib/request";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/review/star-rating";
import { newReviewSchema, NewReviewType } from "@/schemas/new-review";
import { UPLOADCARE_PUBLIC_KEY } from "@/lib/constant/uploadcare.constant";

import "@uploadcare/react-uploader/core.css";
const FileUploaderRegular = dynamic(
  () =>
    import("@uploadcare/react-uploader").then((mod) => mod.FileUploaderRegular),
  { ssr: false }
);

type Field = "message" | "customerName" | "customerEmail";

const fieldIds: Record<Field, string> = {
  message: "message",
  customerName: "name",
  customerEmail: "email",
};

type Errors = FieldErrors<NewReviewType>;

function FieldError({ field, errors }: { field: Field; errors: Errors }) {
  const error = errors[field]?.message;
  if (!error) return null;

  return (
    <p
      id={`${fieldIds[field]}-error`}
      className="-mt-2 mb-3 text-sm text-red-600 dark:text-red-400"
    >
      {error}
    </p>
  );
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-red-600 dark:text-red-400">
      *
    </span>
  );
}

const invalidProps = (field: Field, errors: Errors) => ({
  "aria-invalid": errors[field] ? true : undefined,
  "aria-describedby": errors[field] ? `${fieldIds[field]}-error` : undefined,
});

interface ProductProps {
  id: string;
  title: string;
  message: string;
}

export default function ReviewForm({
  productDetails,
}: {
  productDetails: ProductProps;
}) {
  const router = useRouter();
  const [imageName, setImageName] = useState("");
  const {
    register,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<NewReviewType>({
    resolver: zodResolver(newReviewSchema),
    defaultValues: {
      id: productDetails.id,
      message: "",
      customerName: "",
      customerEmail: "",
      customerImage: "",
      rating: 5,
    },
  });

  const busy = isSubmitting || isSubmitSuccessful;

  const onInvalid = (fieldErrors: Errors) => {
    if (fieldErrors.customerImage?.message) {
      toast.error(fieldErrors.customerImage.message);
    }
  };

  const onSubmit = async (review: NewReviewType) => {
    const toastId = toast.loading("Loading...");

    try {
      const data = await request("/api/reviews", "POST", review);

      toast.dismiss(toastId);
      toast.success(data.message);
      router.push(`${productDetails.id}/submitted`);
    } catch (err) {
      toast.dismiss(toastId);

      const message = errorMessage(
        err,
        "Could not send your review. Try again."
      );

      toast.error(message);
      // A root error keeps isSubmitSuccessful false, so the button unlocks for a retry.
      setError("root", { message });
    }
  };

  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-5 py-12">
      <section className="shadow-card-raised border-border bg-card w-full max-w-lg rounded-2xl border p-6 sm:p-8">
        <h1 className="text-foreground text-center text-2xl font-semibold tracking-tight break-words sm:text-3xl">
          {productDetails.title}
        </h1>

        <p className="text-muted-foreground mt-2 mb-6 text-center text-[15px] break-words">
          {productDetails.message}
        </p>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
          <Label htmlFor="message">
            Message <RequiredMark />
          </Label>
          <Textarea
            className="mt-1.5 mb-3 resize-none aria-invalid:border-red-500"
            id="message"
            required
            {...register("message")}
            {...invalidProps("message", errors)}
          />
          <FieldError field="message" errors={errors} />

          <Label htmlFor="name">
            Your name <RequiredMark />
          </Label>
          <Input
            className="mt-1.5 mb-3 aria-invalid:border-red-500"
            id="name"
            required
            {...register("customerName")}
            {...invalidProps("customerName", errors)}
          />
          <FieldError field="customerName" errors={errors} />

          <Label htmlFor="email">
            Your email <RequiredMark />
          </Label>
          <Input
            className="mt-1.5 mb-3 aria-invalid:border-red-500"
            id="email"
            required
            type="email"
            {...register("customerEmail")}
            {...invalidProps("customerEmail", errors)}
          />
          <FieldError field="customerEmail" errors={errors} />

          <Label className="block">
            Profile picture{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <FileUploaderRegular
            pubkey={UPLOADCARE_PUBLIC_KEY}
            store={false}
            maxLocalFileSizeBytes={10000000}
            multiple={false}
            imgOnly={true}
            sourceList="local, camera"
            useCloudImageEditor={false}
            classNameUploader="my-config"
            className="my-2 mr-3 inline-block"
            onFileUploadSuccess={(e) => {
              setValue("customerImage", e.cdnUrl);
              setImageName(e.name);
            }}
            onFileRemoved={() => {
              setValue("customerImage", "");
              setImageName("");
            }}
          />
          <span className="text-muted-foreground text-sm">{imageName}</span>

          <Label className="mt-2 block" id="rating-label">
            Rating <RequiredMark />
          </Label>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <StarRating
                value={field.value}
                onChange={field.onChange}
                labelledBy="rating-label"
              />
            )}
          />

          <Button className="mt-6 h-11 w-full" type="submit" disabled={busy}>
            {busy ? "Submitting..." : "Submit review"}
          </Button>
        </form>
      </section>
    </main>
  );
}
