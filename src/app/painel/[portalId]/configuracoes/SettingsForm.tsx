"use client";

import { useActionState, useState } from "react";
import { updateSettings } from "../../actions";

type Portal = {
  id: string;
  name: string;
  slug: string;
  description: string;
  primaryColor: string;
  logoUrl: string | null;
  customDomain: string | null;
};

const STATUS = {
  ativo: { label: "Ativo, com HTTPS", className: "bg-emerald-50 text-emerald-700" },
  "aguardando-dns": { label: "Aguardando DNS", className: "bg-amber-50 text-amber-700" },
  desconhecido: { label: "Não verificado", className: "bg-paper text-muted" },
} as const;

export function SettingsForm({
  portal,
  rootDomain,
  domainStatus,
}: {
  portal: Portal;
  rootDomain: string;
  domainStatus: keyof typeof STATUS | null;
}) {
  const [state, action, pending] = useActionState(updateSettings.bind(null, portal.id), undefined);
  const [color, setColor] = useState(portal.primaryColor);

  return (
    <form action={action} className="max-w-xl space-y-6">
      <section className="space-y-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-bold">Identidade</h2>
        <div>
          <label className="label" htmlFor="name">Nome do portal</label>
          <input id="name" name="name" defaultValue={portal.name} className="field" required />
        </div>
        <div>
          <label className="label" htmlFor="description">Descrição</label>
          <input id="description" name="description" defaultValue={portal.description} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="logoUrl">Logo (URL da imagem, opcional)</label>
          <input id="logoUrl" name="logoUrl" type="url" defaultValue={portal.logoUrl ?? ""} className="field" placeholder="https://…" />
        </div>
        <div>
          <label className="label" htmlFor="primaryColor">Cor da marca</label>
          <div className="flex items-center gap-3">
            <input
              id="primaryColor"
              name="primaryColor"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-line bg-white"
            />
            <span className="font-mono text-sm">{color}</span>
            <span className="ml-auto rounded px-3 py-1 text-sm font-bold text-white" style={{ background: color }}>
              ÚLTIMAS
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-bold">Domínio</h2>
        <p className="text-sm text-muted">
          Endereço grátis: <span className="font-semibold text-ink">{portal.slug}.{rootDomain}</span>
        </p>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="customDomain">Domínio próprio</label>
            {domainStatus && (
              <span className={`mb-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS[domainStatus].className}`}>
                {STATUS[domainStatus].label}
              </span>
            )}
          </div>
          <input
            id="customDomain"
            name="customDomain"
            defaultValue={portal.customDomain ?? ""}
            className="field"
            placeholder="www.seuportal.com.br"
          />
          <div className="mt-2 space-y-1 text-xs leading-relaxed text-muted">
            <p>No painel do seu domínio (ex.: Registro.br), crie um destes registros:</p>
            <p>
              Com www (<b>www.seuportal.com.br</b>): <b>CNAME</b> → <code className="text-ink">cname.vercel-dns.com</code>
            </p>
            <p>
              Sem www (<b>seuportal.com.br</b>): <b>A</b> → <code className="text-ink">76.76.21.21</code>
            </p>
            <p>O HTTPS é emitido sozinho assim que o DNS propagar (de minutos a algumas horas).</p>
          </div>
        </div>
      </section>

      {state?.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.ok}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "Salvando…" : "Salvar configurações"}</button>
    </form>
  );
}
