import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewProduct from "@/components/product/new-product";

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return <NewProduct />;
}
