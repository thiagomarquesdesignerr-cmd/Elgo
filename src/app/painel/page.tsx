import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { portalUrl } from "@/lib/utils";

export default async function Painel() {
  const user = await requireUser();
  const portals = await db.portal.findMany({
    where: { ownerId: user.id },
    include: { _count: { select: { articles: true } } },
    orderBy: { createdAt: "asc" },
  });
  if (portals.length === 0) redirect("/painel/novo");

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Seus portais</h1>
        <Link href="/painel/novo" className="btn btn-primary">+ Novo portal</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portals.map((p) => (
          <Link
            key={p.id}
            href={`/painel/${p.id}`}
            className="group rounded-xl border border-line bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-4 h-1.5 w-10 rounded-full" style={{ background: p.primaryColor }} />
            <h2 className="font-display text-xl font-bold tracking-tight">{p.name}</h2>
            <p className="mt-1 truncate text-sm text-muted">{portalUrl(p).replace(/^https?:\/\//, "")}</p>
            <p className="mt-4 text-sm">
              {p._count.articles} {p._count.articles === 1 ? "matéria" : "matérias"} · plano {p.plan}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
