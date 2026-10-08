"use client";

import { errorMessage, request } from "@/lib/request";
import { toast } from "sonner";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { NewProductType } from "@/schemas/new-product";

const fields: {
  id: keyof NewProductType;
  label: string;
  hint: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  {
    id: "name",
    label: "Product name",
    hint: "Only you see this, on your dashboard.",
    placeholder: "Acme",
  },
  {
    id: "title",
    label: "Page title",
    hint: "The heading customers see when they open your link.",
    placeholder: "How are you finding Acme?",
  },
  {
    id: "message",
    label: "Message",
    hint: "A short note asking for a review.",
    placeholder: "We read every reply. Tell us what you love and what to fix.",
    multiline: true,
  },
];

export default function ProductForm({
  form,
  onCreated,
}: {
  form: UseFormReturn<NewProductType>;
  onCreated: (product: { id: string; name: string }) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (product: NewProductType) => {
    try {
      const data = await request<{ message: string; id: string }>(
        "/api/product",
        "POST",
        product
      );

      toast.success(data.message);
      onCreated({ id: data.id, name: product.name });
      reset();
    } catch (err) {
      toast.error(
        errorMessage(err, "Could not create the product. Try again.")
      );
    }
  };

  return (
    <form className="mt-10" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-7">
        {fields.map((field) => {
          const error = errors[field.id]?.message;

          const inputProps = {
            ...register(field.id),
            id: field.id,
            placeholder: field.placeholder,
            "aria-required": true,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": `${field.id}-hint`,
            className: "mt-2 bg-white aria-invalid:border-red-500",
          };

          return (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>

              {field.multiline ? (
                <Textarea
                  {...inputProps}
                  rows={3}
                  className={`${inputProps.className} resize-none`}
                />
              ) : (
                <Input {...inputProps} />
              )}

              <p
                id={`${field.id}-hint`}
                className={`mt-2 text-sm ${error ? "text-red-600" : "text-zinc-500"}`}
              >
                {error ?? field.hint}
              </p>
            </div>
          );
        })}
      </div>

      <Button
        className="mt-10 h-11 w-full"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create product"}
      </Button>
    </form>
  );
}
