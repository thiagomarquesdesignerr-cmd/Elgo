import Link from "next/link";
import { db } from "@/lib/db";
import { requirePortal } from "@/lib/auth";
import { timeAgo } from "@/lib/utils";

export default async function Materias({ params }: { params: Promise<{ portalId: string }> }) {
  const { portalId } = await params;
  const { portal } = await requirePortal(portalId);
  const articles = await db.article.findMany({
    where: { portalId: portal.id },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });
  const publishedCount = articles.filter((a) => a.status === "publicado").length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

  return (
    <>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          ["Publicadas", publishedCount],
          ["Rascunhos", articles.length - publishedCount],
          ["Visualizações", totalViews.toLocaleString("pt-BR")],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-12 text-center">
          <p className="font-display text-xl font-bold tracking-tight">Nenhuma matéria ainda</p>
          <p className="mt-1 text-muted">Escreva a primeira e ela aparece no portal na hora.</p>
          <Link href={`/painel/${portal.id}/materias/nova`} className="btn btn-primary mt-5">Escrever matéria</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <ul className="divide-y divide-line">
            {articles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/painel/${portal.id}/materias/${a.id}`}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-paper"
                >
                  {a.coverUrl ? (
                    <img src={a.coverUrl} alt="" className="hidden h-12 w-20 shrink-0 rounded object-cover sm:block" />
                  ) : (
                    <div className="hidden h-12 w-20 shrink-0 rounded bg-line sm:block" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {a.featured && <span className="mr-1.5 text-accent">★</span>}
                      {a.title}
                    </p>
                    <p className="truncate text-sm text-muted">
                      {a.category?.name ?? "Sem editoria"} · editada {timeAgo(a.updatedAt)} · {a.views} views
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      a.status === "publicado" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {a.status === "publicado" ? "Publicada" : "Rascunho"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
