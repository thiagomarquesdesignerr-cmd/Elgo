import "server-only";

// Liga e desliga os domínios próprios dos clientes no projeto da Vercel, que emite o HTTPS sozinha.
// Sem VERCEL_TOKEN/VERCEL_PROJECT_ID (ex.: rodando local), tudo vira no-op.

const API = "https://api.vercel.com";

function config() {
  const token = process.env.VERCEL_TOKEN;
  const project = process.env.VERCEL_PROJECT_ID;
  if (!token || !project) return null;
  const team = process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : "";
  return { token, project, team };
}

async function call(path: string, init: RequestInit = {}) {
  const c = config()!;
  const res = await fetch(`${API}${path}${c.team}`, {
    ...init,
    headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

export const vercelEnabled = () => config() !== null;

export async function addDomain(domain: string): Promise<{ error?: string }> {
  if (!config()) return {};
  const { ok, body } = await call(`/v10/projects/${config()!.project}/domains`, {
    method: "POST",
    body: JSON.stringify({ name: domain }),
  });
  // Domínio já ligado a este projeto não é erro.
  if (ok || body?.error?.code === "domain_already_in_use_by_project") return {};
  return { error: body?.error?.message ?? "Não foi possível ligar o domínio." };
}

export async function removeDomain(domain: string) {
  if (!config()) return;
  await call(`/v9/projects/${config()!.project}/domains/${domain}`, { method: "DELETE" });
}

export type DomainStatus = "ativo" | "aguardando-dns" | "desconhecido";

export async function domainStatus(domain: string): Promise<DomainStatus> {
  if (!config()) return "desconhecido";
  const [project, dns] = await Promise.all([
    call(`/v9/projects/${config()!.project}/domains/${domain}`),
    call(`/v6/domains/${domain}/config`),
  ]);
  if (!project.ok) return "desconhecido";
  return project.body?.verified && dns.body?.misconfigured === false ? "ativo" : "aguardando-dns";
}
