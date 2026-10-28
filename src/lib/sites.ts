import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isLayout, type LayoutId } from "./layouts";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { db } from "./db";
import { ROOT_DOMAIN } from "./utils";

// Resolve o portal a partir do host da requisição: <slug>.<ROOT_DOMAIN> ou domínio próprio.
export const getPortalByHost = cache(async (rawHost: string) => {
  const host = decodeURIComponent(rawHost).toLowerCase();
  const suffix = `.${ROOT_DOMAIN}`;
  const portal = host.endsWith(suffix)
    ? await db.portal.findUnique({ where: { slug: host.slice(0, -suffix.length) } })
    : await db.portal.findUnique({ where: { customDomain: host.replace(/:\d+$/, "") } });
  if (!portal) notFound();
  return portal;
});

// Layout em uso: o publicado, ou o da prévia quando a URL tem ?previa=<layout>.
export async function getActiveLayout(portal: { layout: string }): Promise<{ layout: LayoutId; preview: boolean }> {
  const previa = (await headers()).get("x-elgo-previa");
  if (isLayout(previa)) return { layout: previa, preview: previa !== portal.layout };
  return { layout: isLayout(portal.layout) ? portal.layout : "classico", preview: false };
}

export const getCategories = cache((portalId: string) =>
  db.category.findMany({ where: { portalId }, orderBy: [{ position: "asc" }, { name: "asc" }] }),
);

export const published = { status: "publicado", publishedAt: { lte: new Date() } } as const;

export function renderMarkdown(md: string) {
  const html = marked.parse(md, { async: false, gfm: true, breaks: true });
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption", "iframe"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "loading"],
      iframe: ["src", "width", "height", "allowfullscreen", "title"],
    },
    // Só incorporações de vídeo de fontes conhecidas
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
  });
}
