import { db } from "@/lib/db";
import { requirePortal } from "@/lib/auth";
import { ArticleForm } from "@/components/ArticleForm";
import { saveArticle } from "../../../actions";

export default async function NovaMateria({ params }: { params: Promise<{ portalId: string }> }) {
  const { portalId } = await params;
  const { portal, user } = await requirePortal(portalId);
  const categories = await db.category.findMany({ where: { portalId: portal.id }, orderBy: { position: "asc" } });

  return (
    <ArticleForm
      action={saveArticle.bind(null, portal.id, null)}
      categories={categories}
      defaultAuthor={user.name}
    />
  );
}
