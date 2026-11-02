export default function EmptyState({
  title,
  body,
  className = "",
  children,
}: {
  title: string;
  body: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`border-border bg-card flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center ${className}`}
    >
      <h2 className="text-foreground font-medium">{title}</h2>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">{body}</p>
      {children}
    </section>
  );
}
