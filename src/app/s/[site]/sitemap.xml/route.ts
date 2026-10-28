import { db } from "@/lib/db";
import { getCategories, getPortalByHost, published } from "@/lib/sites";
import { portalUrl } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: Promise<{ site: string }> }) {
  const portal = await getPortalByHost((await params).site);
  const base = portalUrl(portal);
  const [articles, categories] = await Promise.all([
    db.article.findMany({
      where: { portalId: portal.id, ...published },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, updatedAt: true },
    }),
    getCategories(portal.id),
  ]);

  const urls = [
    `<url><loc>${base}/</loc><changefreq>hourly</changefreq></url>`,
    ...categories.map((c) => `<url><loc>${base}/${c.slug}</loc><changefreq>hourly</changefreq></url>`),
    ...articles.map((a) => `<url><loc>${base}/noticia/${a.slug}</loc><lastmod>${a.updatedAt.toISOString()}</lastmod></url>`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
