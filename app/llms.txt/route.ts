import { llms } from "fumadocs-core/source/llms";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const docs = await llms(source).index();

  return new Response(`# Vouch

> Collect testimonials with one link and show the best ones on your site.

${docs.replace("# Documentation", "## Docs")}

## Legal

- [Terms of Service](/terms)
- [Privacy Policy](/privacy)
`);
}
