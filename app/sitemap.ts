import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000/";

  return [
    ...["/", "/terms", "/privacy"].map((path) => ({
      url: new URL(path, baseUrl).href,
    })),
    ...source
      .getPages()
      .map((page) => ({ url: new URL(page.url, baseUrl).href })),
  ];
}
