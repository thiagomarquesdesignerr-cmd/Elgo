"use client";

import { useActionState, useState } from "react";
import { createPortal } from "../actions";
import { slugify } from "@/lib/utils";
import { LAYOUTS, type LayoutId } from "@/lib/layouts";
import { LayoutThumb } from "@/components/LayoutThumb";

export function NewPortalForm({ rootDomain }: { rootDomain: string }) {
  const [state, action, pending] = useActionState(createPortal, undefined);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [layout, setLayout] = useState<LayoutId>("classico");
  const shownSlug = slugTouched ? slug : slugify(name).replace(/-/g, "");

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">Nome do portal</label>
        <input
          className="field"
          id="name"
          name="name"
          placeholder="Ex.: Diário do Vale"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="slug">Endereço</label>
        <div className="flex items-center rounded-lg border border-line bg-white focus-within:border-ink">
          <input
            className="w-full min-w-0 rounded-l-lg bg-transparent px-3 py-2.5 text-[0.95rem] outline-none"
            id="slug"
            name="slug"
            value={shownSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""));
            }}
            required
          />
          <span className="shrink-0 pr-3 text-sm text-muted">.{rootDomain}</span>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="description">Descrição curta</label>
        <input className="field" id="description" name="description" placeholder="Notícias de Vale Verde e região" />
      </div>
      <fieldset>
        <legend className="label">Layout inicial</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {LAYOUTS.map((l) => (
            <label
              key={l.id}
              className={`cursor-pointer overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                layout === l.id ? "border-accent" : "border-line hover:border-ink/30"
              }`}
            >
              <input type="radio" name="layout" value={l.id} checked={layout === l.id} onChange={() => setLayout(l.id)} className="sr-only" />
              <div className="border-b border-line"><LayoutThumb layout={l.id} /></div>
              <p className="px-2 py-1.5 text-sm font-semibold">{l.name}</p>
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">Dá pra trocar depois em Aparência, com prévia antes de publicar.</p>
      </fieldset>
      {state?.error &&<p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Criando…" : "Criar portal"}
      </button>
    </form>
  );
}
