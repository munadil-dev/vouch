"use client";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { newProductSchema, NewProductType } from "@/schemas/new-product";

const fields: {
  id: keyof NewProductType;
  label: string;
  multiline?: boolean;
}[] = [
  { id: "name", label: "Product name" },
  { id: "title", label: "Page title" },
  { id: "message", label: "Message", multiline: true },
];

export default function EditProductDialog({
  productId,
  values,
  onSaved,
  open,
  onOpenChange,
  returnFocusRef,
}: {
  productId: string;
  values: NewProductType;
  onSaved: (saved: NewProductType) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isSaving) onOpenChange(next);
      }}
    >
      <DialogContent finalFocus={returnFocusRef}>
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>

          <DialogDescription>
            Changes show on your review page right away.
          </DialogDescription>
        </DialogHeader>

        <EditProductForm
          productId={productId}
          values={values}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          onSaved={(saved) => {
            onSaved(saved);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditProductForm({
  productId,
  values,
  isSaving,
  setIsSaving,
  onSaved,
}: {
  productId: string;
  values: NewProductType;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  onSaved: (saved: NewProductType) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewProductType>({
    resolver: zodResolver(newProductSchema),
    defaultValues: values,
  });

  const onSubmit = async (product: NewProductType) => {
    setIsSaving(true);

    try {
      const res = await axios.patch(`/api/product/${productId}`, product);

      if (res.data.success) {
        toast.success(res.data.message);
        onSaved(product);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message ??
            "Could not save the product. Try again."
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-5">
        {fields.map((field) => {
          const id = `edit-${field.id}`;
          const error = errors[field.id]?.message;

          const inputProps = {
            ...register(field.id),
            id,
            "aria-required": true,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? `${id}-error` : undefined,
            className: "mt-2 aria-invalid:border-red-500",
          };

          return (
            <div key={field.id}>
              <Label htmlFor={id}>{field.label}</Label>

              {field.multiline ? (
                <Textarea
                  {...inputProps}
                  rows={3}
                  className={`${inputProps.className} resize-none`}
                />
              ) : (
                <Input {...inputProps} />
              )}

              {error && (
                <p id={`${id}-error`} className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <DialogFooter className="mt-8">
        <DialogClose
          disabled={isSaving}
          render={<Button type="button" variant="outline" />}
        >
          Cancel
        </DialogClose>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
