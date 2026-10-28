import Link from "next/link";
import { ArticleCard, Kicker, type CardArticle } from "./ArticleCard";
import { formatDate, formatTime, timeAgo } from "@/lib/utils";

type HomeArticle = CardArticle & { featured: boolean; views: number };
type HomeProps = { articles: HomeArticle[]; categories: { id: string; name: string; slug: string }[] };

const href = (a: { slug: string }) => `/noticia/${a.slug}`;

// Destaques primeiro (mais recente no topo), depois o restante, sem repetir.
function split(articles: HomeArticle[], secondaryCount: number) {
  const featured = articles.filter((a) => a.featured);
  const lead = featured[0] ?? articles[0];
  const secondary = [...featured, ...articles]
    .filter((a, i, all) => a.id !== lead.id && all.indexOf(a) === i)
    .slice(0, secondaryCount);
  const used = new Set([lead.id, ...secondary.map((a) => a.id)]);
  return { lead, secondary, rest: articles.filter((a) => !used.has(a.id)) };
}

const mostRead = (articles: HomeArticle[], n = 5) => [...articles].sort((a, b) => b.views - a.views).slice(0, n);

function SectionTitle({ children, href }: { children: React.ReactNode; href?: string }) {
  return (
    <div className="mb-5 flex items-baseline justify-between border-t-4 border-[var(--portal)] pt-2">
      <h2 className="text-sm font-black tracking-widest uppercase">{children}</h2>
      {href && <Link href={href} className="text-sm font-semibold text-[var(--portal)] hover:underline">Ver tudo →</Link>}
    </div>
  );
}

function MostRead({ articles }: { articles: HomeArticle[] }) {
  return (
    <ol className="space-y-5">
      {mostRead(articles).map((a, i) => (
        <li key={a.id} className="flex gap-4">
          <span className="font-serif text-4xl leading-none font-black text-[var(--portal)]">{i + 1}</span>
          <Link href={href(a)} className="font-serif text-lg leading-snug font-bold hover:underline">{a.title}</Link>
        </li>
      ))}
    </ol>
  );
}

function CategoryBlocks({ articles, categories }: HomeProps) {
  return (
    <>
      {categories.map((c) => {
        const items = articles.filter((a) => a.category?.slug === c.slug).slice(0, 3);
        if (items.length === 0) return null;
        return (
          <section key={c.id}>
            <SectionTitle href={`/${c.slug}`}>{c.name}</SectionTitle>
            <div className="grid gap-8 sm:grid-cols-3">
              {items.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        );
      })}
    </>
  );
}

/* ── Clássico ─────────────────────────────────────────────── */
export function HomeClassico({ articles, categories }: HomeProps) {
  const { lead, secondary, rest } = split(articles, 3);
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <ArticleCard article={lead} size="lg" />
        <div className="space-y-6 lg:border-l lg:border-line lg:pl-8">
          {secondary.map((a) => (
            <div key={a.id} className="border-b border-line pb-6 last:border-0 last:pb-0">
              <ArticleCard article={a} size="sm" />
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <section>
          <SectionTitle>Últimas notícias</SectionTitle>
          <div className="grid gap-8 sm:grid-cols-2">{rest.slice(0, 6).map((a) => <ArticleCard key={a.id} article={a} />)}</div>
        </section>
        <aside>
          <SectionTitle>Mais lidas</SectionTitle>
          <MostRead articles={articles} />
        </aside>
      </div>
      <CategoryBlocks articles={articles} categories={categories} />
    </div>
  );
}

/* ── Feed (estilo grandes portais) ────────────────────────── */
export function HomeFeed({ articles }: HomeProps) {
  const { lead, secondary, rest } = split(articles, 2);
  const related = rest.filter((a) => a.category?.slug === lead.category?.slug).slice(0, 2);
  const feed = rest.filter((a) => !related.includes(a));

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Link href={href(lead)} className="group block">
            {lead.coverUrl && <img src={lead.coverUrl} alt="" className="aspect-[16/9] w-full rounded-lg object-cover" />}
            <div className="mt-3"><Kicker article={lead} /></div>
            <h1 className="mt-1 text-3xl leading-tight font-extrabold tracking-tight group-hover:underline sm:text-4xl">{lead.title}</h1>
          </Link>
          {related.length > 0 && (
            <ul className="mt-3 space-y-2">
              {related.map((a) => (
                <li key={a.id} className="flex gap-2 text-[15px]">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--portal)]" />
                  <Link href={href(a)} className="font-semibold hover:underline">{a.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="grid content-start gap-6">
          {secondary.map((a) => (
            <Link key={a.id} href={href(a)} className="group block">
              {a.coverUrl && <img src={a.coverUrl} alt="" className="aspect-[16/9] w-full rounded-lg object-cover" />}
              <div className="mt-2"><Kicker article={a} /></div>
              <h2 className="mt-0.5 text-xl leading-snug font-bold group-hover:underline">{a.title}</h2>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-10 border-t border-line pt-8 lg:grid-cols-[2fr_1fr]">
        <section className="divide-y divide-line">
          {feed.map((a) => (
            <Link key={a.id} href={href(a)} className="group grid gap-4 py-6 first:pt-0 sm:grid-cols-[240px_1fr]">
              {a.coverUrl ? (
                <img src={a.coverUrl} alt="" loading="lazy" className="aspect-[16/9] w-full rounded-lg object-cover" />
              ) : <div className="hidden sm:block" />}
              <div>
                <Kicker article={a} />
                <h3 className="mt-0.5 text-xl leading-snug font-bold group-hover:underline">{a.title}</h3>
                {a.summary && <p className="mt-1.5 line-clamp-2 text-muted">{a.summary}</p>}
                <p className="mt-2 text-xs text-muted">
                  {timeAgo(a.publishedAt)}{a.category && ` — Em ${a.category.name}`}
                </p>
              </div>
            </Link>
          ))}
        </section>
        <aside>
          <SectionTitle>Mais lidas</SectionTitle>
          <MostRead articles={articles} />
        </aside>
      </div>
    </div>
  );
}

/* ── Revista ──────────────────────────────────────────────── */
export function HomeRevista({ articles, categories }: HomeProps) {
  const { lead, secondary, rest } = split(articles, 3);
  return (
    <div className="space-y-14">
      <Link href={href(lead)} className="group relative -mx-4 -mt-8 block overflow-hidden bg-ink sm:mx-0 sm:mt-0 sm:rounded-xl">
        {lead.coverUrl && (
          <img src={lead.coverUrl} alt="" className="aspect-[4/5] w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:aspect-[21/9]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
          {lead.category && <span className="rounded bg-[var(--portal)] px-2 py-1 text-xs font-bold tracking-wider uppercase">{lead.category.name}</span>}
          <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-[1.05] font-black sm:text-6xl">{lead.title}</h1>
          {lead.summary && <p className="mt-3 hidden max-w-2xl text-lg text-white/80 sm:block">{lead.summary}</p>}
        </div>
      </Link>

      <section className="grid gap-8 sm:grid-cols-3">
        {secondary.map((a) => <ArticleCard key={a.id} article={a} />)}
      </section>

      <section>
        <SectionTitle>Mais histórias</SectionTitle>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {rest.slice(0, 8).map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      </section>

      <CategoryBlocks articles={articles} categories={categories} />
    </div>
  );
}

/* ── Plantão ──────────────────────────────────────────────── */
export function HomePlantao({ articles }: HomeProps) {
  const featured = articles.filter((a) => a.featured).slice(0, 3);
  const todayKey = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

  return (
    <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
      <section>
        <h1 className="mb-6 flex items-center gap-2 text-sm font-black tracking-widest uppercase">
          <span className="size-2 animate-pulse rounded-full bg-red-600" /> Últimas
        </h1>
        <ol className="relative border-l-2 border-line">
          {articles.map((a) => {
            const isToday = a.publishedAt?.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }) === todayKey;
            return (
              <li key={a.id} className="relative pb-8 pl-6 last:pb-0">
                <span className="absolute top-1.5 -left-[7px] size-3 rounded-full border-2 border-white bg-[var(--portal)]" />
                <time className="text-sm font-bold text-[var(--portal)] tabular-nums">
                  {isToday ? formatTime(a.publishedAt) : formatDate(a.publishedAt)}
                </time>
                <Link href={href(a)} className="group mt-1 block">
                  <Kicker article={a} />
                  <h2 className="mt-0.5 font-serif text-2xl leading-snug font-bold group-hover:underline">{a.title}</h2>
                  {a.summary && <p className="mt-1 text-muted">{a.summary}</p>}
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
      <aside className="space-y-10 lg:sticky lg:top-14 lg:self-start">
        {featured.length > 0 && (
          <div>
            <SectionTitle>Destaques</SectionTitle>
            <div className="space-y-6">{featured.map((a) => <ArticleCard key={a.id} article={a} />)}</div>
          </div>
        )}
        <div>
          <SectionTitle>Mais lidas</SectionTitle>
          <MostRead articles={articles} />
        </div>
      </aside>
    </div>
  );
}

/* ── Coluna ───────────────────────────────────────────────── */
export function HomeColuna({ articles }: HomeProps) {
  const [lead, ...rest] = articles;
  return (
    <div className="mx-auto max-w-2xl">
      <Link href={href(lead)} className="group block">
        {lead.coverUrl && <img src={lead.coverUrl} alt="" className="aspect-[3/2] w-full rounded object-cover" />}
        <p className="mt-5 text-sm text-muted">
          {lead.category && <span className="font-semibold text-[var(--portal)]">{lead.category.name} · </span>}
          {formatDate(lead.publishedAt)}
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-[1.1] font-bold group-hover:underline sm:text-5xl">{lead.title}</h1>
        {lead.summary && <p className="mt-3 font-serif text-xl leading-relaxed text-muted">{lead.summary}</p>}
      </Link>
      <div className="mt-10 divide-y divide-line border-t border-line">
        {rest.map((a) => (
          <Link key={a.id} href={href(a)} className="group block py-8">
            <p className="text-sm text-muted">
              {a.category && <span className="font-semibold text-[var(--portal)]">{a.category.name} · </span>}
              {formatDate(a.publishedAt)}
            </p>
            <h2 className="mt-1.5 font-serif text-2xl leading-snug font-bold group-hover:underline sm:text-3xl">{a.title}</h2>
            {a.summary && <p className="mt-2 font-serif text-lg text-muted">{a.summary}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
