import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requirePortal } from "@/lib/auth";
import { portalUrl } from "@/lib/utils";
import { ArticleForm } from "@/components/ArticleForm";
import { deleteArticle, saveArticle } from "../../../actions";

export default async function EditarMateria({ params }: { params: Promise<{ portalId: string; articleId: string }> }) {
  const { portalId, articleId } = await params;
  const { portal, user } = await requirePortal(portalId);
  const [article, categories] = await Promise.all([
    db.article.findFirst({ where: { id: articleId, portalId: portal.id } }),
    db.category.findMany({ where: { portalId: portal.id }, orderBy: { position: "asc" } }),
  ]);
  if (!article) notFound();

  return (
    <>
      <ArticleForm
        action={saveArticle.bind(null, portal.id, article.id)}
        article={article}
        categories={categories}
        defaultAuthor={user.name}
      />
      <div className="mt-10 flex items-center justify-between border-t border-line pt-4 text-sm">
        {article.status === "publicado" ? (
          <a href={`${portalUrl(portal)}/noticia/${article.slug}`} target="_blank" className="text-muted hover:text-ink">
            Ver no portal ↗
          </a>
        ) : <span />}
        <form action={deleteArticle.bind(null, portal.id, article.id)}>
          <button className="font-semibold text-red-700 hover:underline">Excluir matéria</button>
        </form>
      </div>
    </>
  );
}
