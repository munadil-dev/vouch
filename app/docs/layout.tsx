import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import ThemeToggle from "@/components/layout/theme-toggle";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <RootProvider theme={{ enabled: false }}>
      <DocsLayout
        tree={source.getPageTree()}
        {...baseOptions()}
        sidebar={{
          footer: (
            <div className="flex items-center justify-between gap-2">
              <span className="text-fd-muted-foreground text-sm">Theme</span>
              <ThemeToggle />
            </div>
          ),
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
