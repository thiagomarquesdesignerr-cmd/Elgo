import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getPortalByHost, published } from "@/lib/sites";
import { ArticleCard } from "@/components/site/ArticleCard";

type Props = { params: Promise<{ site: string; categoria: string }> };

async function load(params: Props["params"]) {
  const { site, categoria } = await params;
  const portal = await getPortalByHost(site);
  const category = await db.category.findUnique({
    where: { portalId_slug: { portalId: portal.id, slug: decodeURIComponent(categoria) } },
  });
  if (!category) notFound();
  return { portal, category };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await load(params);
  return { title: category.name };
}

export default async function CategoryPage({ params }: Props) {
  const { portal, category } = await load(params);
  const articles = await db.article.findMany({
    where: { portalId: portal.id, categoryId: category.id, ...published },
    orderBy: { publishedAt: "desc" },
    take: 30,
    include: { category: { select: { name: true, slug: true } } },
  });

  return (
    <>
      <h1 className="mb-8 border-b-4 border-[var(--portal)] pb-3 font-serif text-4xl font-black">{category.name}</h1>
      {articles.length === 0 ? (
        <p className="py-16 text-center text-muted">Nenhuma notícia nesta editoria ainda.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}
    </>
  );
}
