import Link from "next/link";
import { timeAgo } from "@/lib/utils";

export type CardArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverUrl: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
};

export function Kicker({ article }: { article: CardArticle }) {
  if (!article.category) return null;
  return (
    <span className="text-xs font-bold tracking-wider text-[var(--portal)] uppercase">{article.category.name}</span>
  );
}

export function ArticleCard({
  article,
  size = "md",
}: {
  article: CardArticle;
  size?: "lg" | "md" | "sm";
}) {
  const href = `/noticia/${article.slug}`;

  if (size === "sm") {
    return (
      <Link href={href} className="group flex gap-3">
        <div className="min-w-0 flex-1">
          <Kicker article={article} />
          <h3 className="mt-0.5 font-serif text-lg leading-snug font-bold group-hover:underline">{article.title}</h3>
          <p className="mt-1 text-xs text-muted">{timeAgo(article.publishedAt)}</p>
        </div>
        {article.coverUrl && (
          <img src={article.coverUrl} alt="" className="size-20 shrink-0 rounded object-cover" loading="lazy" />
        )}
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      {article.coverUrl && (
        <div className="mb-3 overflow-hidden rounded">
          <img
            src={article.coverUrl}
            alt=""
            loading={size === "lg" ? "eager" : "lazy"}
            className="aspect-[16/9] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
      )}
      <Kicker article={article} />
      <h2
        className={`mt-1 font-serif leading-tight font-bold group-hover:underline ${
          size === "lg" ? "text-3xl sm:text-4xl" : "text-xl"
        }`}
      >
        {article.title}
      </h2>
      {article.summary && (
        <p className={`mt-2 text-muted ${size === "lg" ? "text-lg" : "line-clamp-2 text-sm"}`}>{article.summary}</p>
      )}
      <p className="mt-2 text-xs text-muted">{timeAgo(article.publishedAt)}</p>
    </Link>
  );
}
