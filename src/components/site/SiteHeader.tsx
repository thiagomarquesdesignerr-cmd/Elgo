import Link from "next/link";
import type { LayoutId } from "@/lib/layouts";

type Props = {
  layout: LayoutId;
  portal: { name: string; description: string; logoUrl: string | null };
  categories: { id: string; slug: string; name: string }[];
};

function Brand({ portal, className }: { portal: Props["portal"]; className: string }) {
  return (
    <Link href="/" className="inline-block">
      {portal.logoUrl ? <img src={portal.logoUrl} alt={portal.name} className="h-10 w-auto" /> : <span className={className}>{portal.name}</span>}
    </Link>
  );
}

function NavLinks({ categories, className }: { categories: Props["categories"]; className: string }) {
  return (
    <>
      <Link href="/" className={className}>Início</Link>
      {categories.map((c) => (
        <Link key={c.id} href={`/${c.slug}`} className={className}>{c.name}</Link>
      ))}
    </>
  );
}

const today = () =>
  new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" }).format(new Date());

export function SiteHeader({ layout, portal, categories }: Props) {
  if (layout === "feed") {
    return (
      <header className="sticky top-0 z-10 bg-[var(--portal)] text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Brand portal={portal} className="text-2xl font-black tracking-tight" />
          <span className="hidden text-sm text-white/75 sm:inline">{portal.description}</span>
        </div>
        <nav className="bg-black/15">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 [scrollbar-width:none]">
            <NavLinks categories={categories} className="shrink-0 px-3 py-2 text-sm font-semibold hover:bg-white/10" />
          </div>
        </nav>
      </header>
    );
  }

  if (layout === "revista") {
    return (
      <header className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
          <Brand portal={portal} className="font-serif text-2xl font-black tracking-tight sm:text-3xl" />
          <nav className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
            <NavLinks categories={categories} className="shrink-0 px-2 py-1 text-xs font-bold tracking-widest text-muted uppercase hover:text-[var(--portal)]" />
          </nav>
        </div>
      </header>
    );
  }

  if (layout === "plantao") {
    return (
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Brand portal={portal} className="font-serif text-3xl font-black tracking-tight" />
            <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-0.5 text-[11px] font-bold tracking-wider text-white uppercase">
              <span className="size-1.5 animate-pulse rounded-full bg-white" /> Ao vivo
            </span>
          </div>
          <span className="hidden text-sm text-muted first-letter:uppercase sm:block">{today()}</span>
        </div>
        <nav className="sticky top-0 z-10 border-y-2 border-[var(--portal)] bg-white">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 [scrollbar-width:none]">
            <NavLinks categories={categories} className="shrink-0 px-3 py-2 text-sm font-bold text-ink hover:text-[var(--portal)]" />
          </div>
        </nav>
      </header>
    );
  }

  if (layout === "coluna") {
    return (
      <header className="mx-auto max-w-2xl px-4 pt-12 pb-6 text-center">
        <Brand portal={portal} className="font-serif text-4xl font-bold italic tracking-tight sm:text-5xl" />
        {portal.description && <p className="mt-2 text-muted">{portal.description}</p>}
        <nav className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 border-y border-line py-3">
          <NavLinks categories={categories} className="text-sm text-muted hover:text-[var(--portal)]" />
        </nav>
      </header>
    );
  }

  // clássico
  return (
    <>
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-xs text-muted">
          <span className="first-letter:uppercase">{today()}</span>
          <a href="/rss.xml" className="hover:text-ink">RSS</a>
        </div>
      </div>
      <header className="mx-auto max-w-6xl px-4 py-6 text-center sm:py-8">
        <Brand portal={portal} className="font-serif text-4xl font-black tracking-tight sm:text-5xl" />
        {portal.description && <p className="mt-2 text-sm text-muted">{portal.description}</p>}
      </header>
      <nav className="sticky top-0 z-10 bg-[var(--portal)] text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 [scrollbar-width:none]">
          <NavLinks categories={categories} className="shrink-0 px-3 py-3 text-sm font-bold tracking-wide uppercase hover:bg-black/15" />
        </div>
      </nav>
    </>
  );
}
