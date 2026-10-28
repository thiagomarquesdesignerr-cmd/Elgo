import { NextResponse, type NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const PLATFORM_HOSTS = new Set([ROOT_DOMAIN, `www.${ROOT_DOMAIN}`, "127.0.0.1:3000"]);

// Roteamento multi-inquilino: qualquer host que não seja a plataforma é um portal
// e é reescrito internamente para /s/<host>/<caminho>.
export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const { pathname, search } = req.nextUrl;

  // Endereços *.vercel.app (deploys de prévia) também abrem a plataforma, não um portal.
  if (PLATFORM_HOSTS.has(host) || host.endsWith(".vercel.app")) {
    // As rotas internas dos portais não devem ser acessadas direto pelo domínio da plataforma.
    if (pathname.startsWith("/s/")) return new NextResponse(null, { status: 404 });
    return NextResponse.next();
  }

  // ?previa=<layout> mostra um layout sem publicar (usado pela prévia em Aparência).
  const headers = new Headers(req.headers);
  headers.delete("x-elgo-previa");
  const previa = req.nextUrl.searchParams.get("previa");
  if (previa) headers.set("x-elgo-previa", previa);

  return NextResponse.rewrite(new URL(`/s/${encodeURIComponent(host)}${pathname}${search}`, req.url), {
    request: { headers },
  });
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico).*)"],
};
