"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePortal, requireUser } from "@/lib/auth";
import { RESERVED_SLUGS, ROOT_DOMAIN, slugify } from "@/lib/utils";
import { addDomain, removeDomain } from "@/lib/vercel";
import { isLayout } from "@/lib/layouts";

export type FormState = { error?: string; ok?: string } | undefined;

const DEFAULT_CATEGORIES = ["Cidades", "Política", "Economia", "Esportes", "Cultura"];

const str = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function createPortal(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = str(form, "name");
  const slug = slugify(str(form, "slug") || name).replace(/-/g, "");

  if (name.length < 2) return { error: "Dê um nome ao portal." };
  if (slug.length < 3) return { error: "O endereço precisa ter pelo menos 3 letras ou números." };
  if (RESERVED_SLUGS.has(slug)) return { error: "Este endereço é reservado. Escolha outro." };
  if (await db.portal.findUnique({ where: { slug } })) return { error: "Este endereço já está em uso." };

  const portal = await db.portal.create({
    data: {
      name,
      slug,
      description: str(form, "description"),
      layout: isLayout(str(form, "layout")) ? str(form, "layout") : "classico",
      ownerId: user.id,
      categories: {
        create: DEFAULT_CATEGORIES.map((c, position) => ({ name: c, slug: slugify(c), position })),
      },
    },
  });
  redirect(`/painel/${portal.id}`);
}

async function uniqueArticleSlug(portalId: string, base: string, exceptId?: string) {
  let slug = base || "materia";
  for (let i = 2; ; i++) {
    const clash = await db.article.findFirst({ where: { portalId, slug, NOT: exceptId ? { id: exceptId } : undefined } });
    if (!clash) return slug;
    slug = `${base}-${i}`;
  }
}

export async function saveArticle(
  portalId: string,
  articleId: string | null,
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const { portal } = await requirePortal(portalId);
  const title = str(form, "title");
  if (!title) return { error: "A matéria precisa de um título." };

  const status = str(form, "status") === "publicado" ? "publicado" : "rascunho";
  const categoryId = str(form, "categoryId") || null;
  if (categoryId && !(await db.category.findFirst({ where: { id: categoryId, portalId } }))) {
    return { error: "Editoria inválida." };
  }

  const existing = articleId ? await db.article.findFirst({ where: { id: articleId, portalId } }) : null;
  if (articleId && !existing) return { error: "Matéria não encontrada." };

  const data = {
    title,
    slug: await uniqueArticleSlug(portalId, slugify(str(form, "slug") || title), existing?.id),
    summary: str(form, "summary"),
    body: String(form.get("body") ?? ""),
    coverUrl: str(form, "coverUrl") || null,
    author: str(form, "author"),
    featured: form.get("featured") === "on",
    categoryId,
    status,
    publishedAt: status === "publicado" ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt ?? null,
  };

  if (existing) {
    await db.article.update({ where: { id: existing.id }, data });
  } else {
    await db.article.create({ data: { ...data, portalId: portal.id } });
  }
  revalidatePath(`/painel/${portalId}`);
  redirect(`/painel/${portalId}`);
}

export async function deleteArticle(portalId: string, articleId: string) {
  await requirePortal(portalId);
  await db.article.deleteMany({ where: { id: articleId, portalId } });
  revalidatePath(`/painel/${portalId}`);
  redirect(`/painel/${portalId}`);
}

export async function createCategory(portalId: string, form: FormData) {
  await requirePortal(portalId);
  const name = str(form, "name");
  const slug = slugify(name);
  if (!slug) return;
  const count = await db.category.count({ where: { portalId } });
  await db.category.upsert({
    where: { portalId_slug: { portalId, slug } },
    update: {},
    create: { name, slug, portalId, position: count },
  });
  revalidatePath(`/painel/${portalId}/editorias`);
}

export async function deleteCategory(portalId: string, categoryId: string) {
  await requirePortal(portalId);
  await db.category.deleteMany({ where: { id: categoryId, portalId } });
  revalidatePath(`/painel/${portalId}/editorias`);
}

export async function publishLayout(portalId: string, layout: string) {
  await requirePortal(portalId);
  if (!isLayout(layout)) return;
  await db.portal.update({ where: { id: portalId }, data: { layout } });
  revalidatePath(`/painel/${portalId}`, "layout");
}

export async function updateSettings(portalId: string, _: FormState, form: FormData): Promise<FormState> {
  const { portal } = await requirePortal(portalId);
  const name = str(form, "name");
  const primaryColor = str(form, "primaryColor");
  const customDomain =
    str(form, "customDomain").toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "") || null;

  if (name.length < 2) return { error: "Dê um nome ao portal." };
  if (!/^#[0-9a-f]{6}$/i.test(primaryColor)) return { error: "Cor inválida." };
  if (customDomain && !/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(customDomain)) return { error: "Domínio inválido." };
  if (customDomain && (await db.portal.findFirst({ where: { customDomain, NOT: { id: portalId } } }))) {
    return { error: "Este domínio já está ligado a outro portal." };
  }
  if (customDomain?.endsWith(ROOT_DOMAIN.split(":")[0])) {
    return { error: "Use um domínio seu. O endereço da Elgo você já tem de graça." };
  }

  if (customDomain !== portal.customDomain) {
    if (customDomain) {
      const { error } = await addDomain(customDomain);
      if (error) return { error };
    }
    if (portal.customDomain) await removeDomain(portal.customDomain);
  }

  await db.portal.update({
    where: { id: portalId },
    data: { name, primaryColor, customDomain, description: str(form, "description"), logoUrl: str(form, "logoUrl") || null },
  });
  revalidatePath(`/painel/${portalId}`, "layout");
  return { ok: "Configurações salvas." };
}
