import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LayoutThumb } from "@/components/LayoutThumb";
import { getCurrentUser } from "@/lib/auth";
import { LAYOUTS } from "@/lib/layouts";
import { ROOT_DOMAIN } from "@/lib/utils";

const features = [
  { n: "01", title: "Redação completa", text: "Matérias, editorias, destaques, rascunhos e autores. Tudo num painel simples." },
  { n: "02", title: "Seu domínio", text: `Comece em seuportal.${ROOT_DOMAIN.split(":")[0]} e conecte seu próprio domínio quando quiser.` },
  { n: "03", title: "Pronto para o Google", text: "Páginas rápidas, sitemap, RSS e metadados para busca e redes sociais." },
  { n: "04", title: "Sua identidade", text: "Logo, cor da marca e layout. Cada portal com a sua cara." },
];

const plans = [
  { name: "Grátis", price: "R$ 0", items: ["1 portal", "Subdomínio Elgo", "Até 100 matérias"] },
  { name: "Pro", price: "R$ 79", items: ["Domínio próprio", "Matérias ilimitadas", "Sem marca Elgo"], highlight: true },
  { name: "Rede", price: "R$ 249", items: ["Até 10 portais", "Equipe com vários editores", "Suporte prioritário"] },
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div>
      <div className="bg-ink text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Logo />
          <nav className="flex items-center gap-2">
            {user ? (
              <Link href="/painel" className="btn btn-brand">Ir para o painel</Link>
            ) : (
              <>
                <Link href="/entrar" className="btn text-white/80 hover:text-white">Entrar</Link>
                <Link href="/cadastro" className="btn btn-brand">Criar portal</Link>
              </>
            )}
          </nav>
        </header>

        <section className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm text-white/80">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-live" />
            </span>
            Hospedagem para jornalismo
          </p>
          <h1 className="max-w-4xl font-display text-5xl leading-[1.02] font-bold tracking-[-0.04em] sm:text-7xl">
            Seu portal de notícias no ar <span className="text-accent">em cinco minutos.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/65">
            Hospedagem, painel de redação e site pronto, num só lugar. Você escreve; a Elgo cuida do resto.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/cadastro" className="btn btn-brand px-6 py-3 text-base">Começar grátis</Link>
            <a href={`http://diariodovale.${ROOT_DOMAIN}`} className="btn border border-white/20 px-6 py-3 text-base hover:bg-white/10">
              Ver portal exemplo
            </a>
          </div>
        </section>
      </div>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="border-line p-6 sm:border-r sm:last:border-r-0">
              <span className="font-display text-sm font-bold text-accent">{f.n}</span>
              <h3 className="mt-2 font-display text-lg font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display text-4xl font-bold tracking-tight">{LAYOUTS.length} layouts prontos</h2>
        <p className="mt-2 text-muted">Troque quando quiser. Você vê a prévia com as suas matérias antes de publicar.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {LAYOUTS.map((l) => (
            <div key={l.id}>
              <div className="overflow-hidden rounded-xl border border-line bg-white">
                <LayoutThumb layout={l.id} />
              </div>
              <p className="mt-2 font-display font-bold">{l.name}</p>
              <p className="text-sm text-muted">{l.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="font-display text-4xl font-bold tracking-tight">Planos</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 ${p.highlight ? "border-ink bg-ink text-white" : "border-line bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold">{p.name}</h3>
                {p.highlight && <span className="rounded-full bg-live px-2 py-0.5 text-xs font-bold text-ink">Mais escolhido</span>}
              </div>
              <p className="mt-3 font-display text-5xl font-bold tracking-tight">
                {p.price}
                <span className={`font-sans text-sm font-normal tracking-normal ${p.highlight ? "text-white/60" : "text-muted"}`}>/mês</span>
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className={p.highlight ? "text-live" : "text-accent"}>✓</span> {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-ink py-10 text-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-sm">
          <Logo size={22} />
          <span>© {new Date().getFullYear()} Elgo</span>
        </div>
      </footer>
    </div>
  );
}
