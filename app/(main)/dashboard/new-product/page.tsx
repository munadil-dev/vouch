"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackLink from "@/components/shared/back-link";
import ProductForm from "@/components/product/product-form";
import ProductPreview from "@/components/product/product-preview";
import ProductCreated from "@/components/product/product-created";
import { newProductSchema, NewProductType } from "@/schemas/new-product";

export default function NewProduct() {
  const [createdProduct, setCreatedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const form = useForm<NewProductType>({
    resolver: zodResolver(newProductSchema),
    defaultValues: { name: "", title: "", message: "" },
  });

  if (createdProduct) {
    return <ProductCreated {...createdProduct} />;
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <section>
          <BackLink />

          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-zinc-950">
            New product
          </h1>

          <p className="mt-3 text-[15px] leading-6 text-zinc-600">
            Set up the page customers see when they open your link. You can
            share it as soon as it&apos;s created.
          </p>

          <ProductForm form={form} onCreated={setCreatedProduct} />
        </section>

        <ProductPreview control={form.control} />
      </div>
    </main>
  );
}
