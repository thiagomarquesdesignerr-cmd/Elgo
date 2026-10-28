import { db } from "@/lib/db";
import { requirePortal } from "@/lib/auth";
import { createCategory, deleteCategory } from "../../actions";

export default async function Editorias({ params }: { params: Promise<{ portalId: string }> }) {
  const { portalId } = await params;
  const { portal } = await requirePortal(portalId);
  const categories = await db.category.findMany({
    where: { portalId: portal.id },
    include: { _count: { select: { articles: true } } },
    orderBy: { position: "asc" },
  });

  return (
    <div className="max-w-xl">
      <p className="mb-4 text-muted">Editorias aparecem no menu do portal, nesta ordem.</p>
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-muted">/{c.slug} · {c._count.articles} matérias</p>
            </div>
            <form action={deleteCategory.bind(null, portal.id, c.id)}>
              <button className="text-sm text-muted hover:text-red-700">Remover</button>
            </form>
          </li>
        ))}
        {categories.length === 0 && <li className="px-4 py-6 text-center text-muted">Nenhuma editoria.</li>}
      </ul>
      <form action={createCategory.bind(null, portal.id)} className="mt-4 flex gap-2">
        <input name="name" placeholder="Nova editoria, ex.: Saúde" className="field" required />
        <button className="btn btn-primary shrink-0">Adicionar</button>
      </form>
    </div>
  );
}
