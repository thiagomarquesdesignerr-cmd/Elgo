import { db } from "@/lib/db";
import { getActiveLayout, getCategories, getPortalByHost, published } from "@/lib/sites";
import { HomeClassico, HomeColuna, HomeFeed, HomePlantao, HomeRevista } from "@/components/site/homes";

const select = {
  id: true, title: true, slug: true, summary: true, coverUrl: true, publishedAt: true, featured: true, views: true,
  category: { select: { name: true, slug: true } },
} as const;

export default async function SiteHome({ params }: { params: Promise<{ site: string }> }) {
  const portal = await getPortalByHost((await params).site);
  const [articles, categories, { layout }] = await Promise.all([
    db.article.findMany({
      where: { portalId: portal.id, ...published },
      orderBy: { publishedAt: "desc" },
      take: 40,
      select,
    }),
    getCategories(portal.id),
    getActiveLayout(portal),
  ]);

  if (articles.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-3xl font-bold">Em breve, as primeiras notícias.</p>
        <p className="mt-2 text-muted">Este portal acabou de ser criado.</p>
      </div>
    );
  }

  const props = { articles, categories };
  switch (layout) {
    case "feed": return <HomeFeed {...props} />;
    case "revista": return <HomeRevista {...props} />;
    case "plantao": return <HomePlantao {...props} />;
    case "coluna": return <HomeColuna {...props} />;
    default: return <HomeClassico {...props} />;
  }
}
