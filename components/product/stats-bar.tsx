export default function StatsBar({
  stats,
  className = "",
}: {
  stats: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl
      className={`shadow-card divide-border border-border bg-card grid grid-cols-3 divide-x rounded-2xl border ${className}`}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="min-w-0 px-4 py-4 sm:px-6 sm:py-5">
          <dt className="text-muted-foreground truncate text-xs sm:text-sm">
            {stat.label}
          </dt>

          <dd className="text-foreground mt-1.5 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
