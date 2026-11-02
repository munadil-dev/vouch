import {
  testimonialColumns,
  testimonials,
} from "@/lib/constant/testimonials.constant";
import { Avatar } from "./avatar";
import { FavoriteToggle } from "./interactive";
import { Stars } from "./stars";

type Testimonial = (typeof testimonials)[number];

function Card({
  testimonial,
  favorite,
}: {
  testimonial: Testimonial;
  favorite: boolean;
}) {
  return (
    <li className="shadow-card-raised border-border bg-card rounded-2xl border p-5">
      <header className="flex items-center gap-3">
        <Avatar name={testimonial.name} size="md" />
        <p className="flex min-w-0 flex-1 flex-col text-sm">
          <span className="text-foreground truncate font-medium">
            {testimonial.name}
          </span>
          <span className="text-muted-foreground truncate">
            {testimonial.username}
          </span>
        </p>
        <FavoriteToggle name={testimonial.name} initial={favorite} />
      </header>
      <blockquote className="text-muted-foreground mt-4 text-[15px] leading-6">
        {testimonial.body}
      </blockquote>
      <Stars count={5} size="sm" className="mt-4" />
    </li>
  );
}

export default function Testimonials() {
  return (
    <section className="overflow-hidden py-16">
      <header className="mx-auto max-w-2xl px-5 text-center">
        <h2 className="text-foreground text-3xl leading-[1.1] font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
          People like being asked
        </h2>
        <p className="text-muted-foreground mt-4 text-lg leading-7 text-pretty">
          Kind words from people who put a review link in front of their
          customers.
        </p>
      </header>

      <div className="mx-auto mt-14 max-w-[100rem] mask-[linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] px-5 md:mask-[linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <div className="overflow-hidden mask-[linear-gradient(to_bottom,#000_65%,transparent)] md:h-[44rem]">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
            {testimonialColumns.map((column, columnIndex) => (
              <ul
                key={columnIndex}
                className={`${column.visibility} ${column.offset} flex-col gap-4 max-md:pt-0`}
              >
                {column.items.map((item, itemIndex) => (
                  <Card
                    key={item}
                    testimonial={testimonials[item]}
                    favorite={(columnIndex + itemIndex) % 3 === 0}
                  />
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
