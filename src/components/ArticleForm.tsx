"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/app/painel/actions";

type Article = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  coverUrl: string | null;
  author: string;
  status: string;
  featured: boolean;
  categoryId: string | null;
};

export function ArticleForm({
  action: save,
  article,
  categories,
  defaultAuthor,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  article?: Article;
  categories: { id: string; name: string }[];
  defaultAuthor: string;
}) {
  const [state, action, pending] = useActionState(save, undefined);
  const [cover, setCover] = useState(article?.coverUrl ?? "");
  const [status, setStatus] = useState(article?.status ?? "rascunho");

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <input
          name="title"
          defaultValue={article?.title}
          placeholder="Título da matéria"
          className="w-full bg-transparent font-serif text-3xl font-bold outline-none placeholder:text-muted/50"
          required
          autoFocus={!article}
        />
        <textarea
          name="summary"
          defaultValue={article?.summary}
          placeholder="Linha fina: um resumo de uma ou duas frases"
          rows={2}
          className="w-full resize-none bg-transparent text-lg text-muted outline-none placeholder:text-muted/50"
        />
        <div>
          <label className="label" htmlFor="body">Texto</label>
          <textarea
            id="body"
            name="body"
            defaultValue={article?.body}
            rows={20}
            className="field font-serif text-[1.05rem] leading-relaxed"
            placeholder={"Escreva aqui. Dicas:\n## Intertítulo\n**negrito**, *itálico*, [link](https://...)\n> citação\n![legenda](https://url-da-imagem.jpg)"}
          />
          <p className="mt-1.5 text-xs text-muted">Aceita Markdown: ## intertítulo, **negrito**, &gt; citação, ![](imagem), links.</p>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="space-y-4 rounded-xl border border-line bg-white p-4">
          <div>
            <span className="label">Status</span>
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-paper p-1">
              {[
                ["rascunho", "Rascunho"],
                ["publicado", "Publicada"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-md py-1.5 text-center text-sm font-semibold transition-colors ${
                    status === value ? "bg-white shadow-sm" : "text-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={value}
                    checked={status === value}
                    onChange={() => setStatus(value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="featured" defaultChecked={article?.featured} className="size-4 accent-ink" />
            Destaque na capa
          </label>
          {state?.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
          <button className="btn btn-primary w-full" disabled={pending}>
            {pending ? "Salvando…" : status === "publicado" ? "Salvar e publicar" : "Salvar rascunho"}
          </button>
        </div>

        <div className="space-y-4 rounded-xl border border-line bg-white p-4">
          <div>
            <label className="label" htmlFor="categoryId">Editoria</label>
            <select id="categoryId" name="categoryId" defaultValue={article?.categoryId ?? ""} className="field">
              <option value="">Sem editoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="author">Autor</label>
            <input id="author" name="author" defaultValue={article?.author ?? defaultAuthor} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="coverUrl">Imagem de capa (URL)</label>
            <input
              id="coverUrl"
              name="coverUrl"
              type="url"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="https://…"
              className="field"
            />
            {cover && <img src={cover} alt="" className="mt-2 aspect-video w-full rounded-md object-cover" />}
          </div>
          <div>
            <label className="label" htmlFor="slug">Endereço da matéria</label>
            <input id="slug" name="slug" defaultValue={article?.slug} placeholder="gerado a partir do título" className="field text-sm" />
          </div>
        </div>
      </aside>
    </form>
  );
}
