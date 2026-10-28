import { db } from "@/lib/db";
import { getPortalByHost, published } from "@/lib/sites";
import { portalUrl } from "@/lib/utils";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(_: Request, { params }: { params: Promise<{ site: string }> }) {
  const portal = await getPortalByHost((await params).site);
  const base = portalUrl(portal);
  const articles = await db.article.findMany({
    where: { portalId: portal.id, ...published },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const items = articles
    .map(
      (a) => `<item>
  <title>${esc(a.title)}</title>
  <link>${base}/noticia/${a.slug}</link>
  <guid isPermaLink="false">${a.id}</guid>
  <pubDate>${a.publishedAt?.toUTCString()}</pubDate>
  <description>${esc(a.summary)}</description>${a.coverUrl ? `\n  <enclosure url="${esc(a.coverUrl)}" type="image/jpeg" />` : ""}
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${esc(portal.name)}</title>
  <link>${base}</link>
  <description>${esc(portal.description)}</description>
  <language>pt-BR</language>
${items}
</channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
