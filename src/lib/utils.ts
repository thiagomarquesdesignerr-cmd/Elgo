export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

export const RESERVED_SLUGS = new Set([
  "www", "app", "api", "admin", "painel", "mail", "blog", "suporte", "status", "cdn", "static",
]);

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const protocol = ROOT_DOMAIN.startsWith("localhost") ? "http" : "https";

export function portalUrl(portal: { slug: string; customDomain?: string | null }) {
  if (portal.customDomain) return `https://${portal.customDomain}`;
  return `${protocol}://${portal.slug}.${ROOT_DOMAIN}`;
}

export function formatDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export function formatTime(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(date);
}

export function timeAgo(date: Date | null | undefined) {
  if (!date) return "";
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  return formatDate(date);
}
