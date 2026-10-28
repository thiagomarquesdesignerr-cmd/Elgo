import type { Metadata } from "next";
import { getActiveLayout, getCategories, getPortalByHost } from "@/lib/sites";
import { LAYOUTS } from "@/lib/layouts";
import { ROOT_DOMAIN } from "@/lib/utils";
import { SiteHeader } from "@/components/site/SiteHeader";

// Notícias precisam estar sempre frescas; cache de borda (CDN) entra na fase de produção.
export const dynamic = "force-dynamic";

type Props = { children: React.ReactNode; params: Promise<{ site: string }> };

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const portal = await getPortalByHost((await params).site);
  return {
    title: { default: portal.name, template: `%s | ${portal.name}` },
    description: portal.description,
    alternates: { types: { "application/rss+xml": "/rss.xml" } },
  };
}

export default async function SiteLayout({ children, params }: Props) {
  const portal = await getPortalByHost((await params).site);
  const [categories, { layout, preview }] = await Promise.all([getCategories(portal.id), getActiveLayout(portal)]);

  return (
    <div style={{ "--portal": portal.primaryColor } as React.CSSProperties} className="min-h-screen bg-white">
      {preview && (
        <div className="bg-ink px-4 py-2 text-center text-sm text-white">
          Prévia do layout <b>{LAYOUTS.find((l) => l.id === layout)?.name}</b>. Os leitores ainda veem o layout publicado.
        </div>
      )}

      <SiteHeader layout={layout} portal={portal} categories={categories} />

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="mt-16 border-t-4 border-[var(--portal)] bg-ink py-10 text-white/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm">
          <span className="font-serif text-xl font-bold text-white">{portal.name}</span>
          <div className="flex gap-4">
            <a href="/rss.xml" className="hover:text-white">RSS</a>
            {portal.plan === "gratis" && <a href={`http://${ROOT_DOMAIN}`} className="hover:text-white">Feito com Elgo</a>}
          </div>
        </div>
      </footer>
    </div>
  );
}
