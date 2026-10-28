import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getPortalByHost, published, renderMarkdown } from "@/lib/sites";
import { formatDate } from "@/lib/utils";
import { ArticleCard } from "@/components/site/ArticleCard";

type Props = { params: Promise<{ site: string; slug: string }> };

const load = cache(async (site: string, slug: string) => {
  const portal = await getPortalByHost(site);
  const article = await db.article.findFirst({
    where: { portalId: portal.id, slug: decodeURIComponent(slug), ...published },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
  if (!article) notFound();
  return { portal, article };
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, slug } = await params;
  const { article } = await load(site, slug);
  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.summary,
      images: article.coverUrl ? [article.coverUrl] : [],
      publishedTime: article.publishedAt?.toISOString(),
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { site, slug } = await params;
  const { portal, article } = await load(site, slug);

  const [related] = await Promise.all([
    db.article.findMany({
      where: { portalId: portal.id, categoryId: article.category?.id, NOT: { id: article.id }, ...published },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { category: { select: { name: true, slug: true } } },
    }),
    // SQL direto para não mexer no updatedAt (que aparece como "Atualizado em").
    db.$executeRaw`UPDATE "Article" SET "views" = "views" + 1 WHERE "id" = ${article.id}`,
  ]);

  return (
    <article>
      <header className="mx-auto max-w-3xl">
        {article.category && (
          <Link
            href={`/${article.category.slug}`}
            className="text-sm font-bold tracking-wider text-[var(--portal)] uppercase hover:underline"
          >
            {article.category.name}
          </Link>
        )}
        <h1 className="mt-2 font-serif text-4xl leading-[1.1] font-black tracking-tight sm:text-5xl">{article.title}</h1>
        {article.summary && <p className="mt-4 text-xl leading-relaxed text-muted">{article.summary}</p>}
        <div className="mt-6 border-y border-line py-3 text-sm">
          {article.author && <p className="font-bold">Por {article.author}</p>}
          <p className="text-muted">
            {formatDate(article.publishedAt)}
            {article.updatedAt.getTime() - (article.publishedAt?.getTime() ?? 0) > 60_000 &&
              ` · Atualizado em ${formatDate(article.updatedAt)}`}
          </p>
        </div>
      </header>

      {article.coverUrl && (
        <img src={article.coverUrl} alt="" className="mx-auto mt-8 aspect-[16/9] w-full max-w-4xl rounded object-cover" />
      )}

      <div
        className="article-body mx-auto mt-8 max-w-3xl"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }}
      />

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-5 border-t-4 border-[var(--portal)] pt-2 text-sm font-black tracking-widest uppercase">
            Leia também
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {related.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      )}
    </article>
  );
}
