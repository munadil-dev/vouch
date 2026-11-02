import Link from "next/link";
import { footerColumns, socialLinks } from "@/lib/constant/footer.constant";

export default function Footer() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Link
            className="font-instrument-serif text-foreground text-xl font-medium"
            href="/"
          >
            Vouch
          </Link>
          <p className="text-muted-foreground mt-3 max-w-xs text-sm">
            Collect testimonials from your customers and show the best ones on
            your website.
          </p>
          <ul className="mt-5 flex items-center gap-4 [&_svg]:size-4.5">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  target="_blank"
                  aria-label={label}
                  className="flex opacity-60 transition-opacity hover:opacity-100"
                >
                  <Icon />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-foreground text-sm font-medium">
              {column.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-border border-t">
        <p className="text-muted-foreground mx-auto max-w-6xl px-5 py-6 text-xs">
          © {new Date().getFullYear()} Vouch. MIT licensed.
        </p>
      </div>

      <div aria-hidden="true" className="overflow-hidden">
        <p className="text-border mx-auto max-w-6xl translate-y-[18%] mask-[linear-gradient(to_bottom,#000_40%,transparent)] px-5 text-center text-[clamp(4.5rem,22vw,20rem)] leading-[0.8] font-semibold tracking-[-0.06em] select-none">
          Vouch
        </p>
      </div>
    </footer>
  );
}
