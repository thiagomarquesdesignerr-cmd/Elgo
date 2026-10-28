import { Logo } from "@/components/Logo";
import { requireUser } from "@/lib/auth";
import { logout } from "@/app/actions/auth";

export const metadata = { title: "Painel — Elgo" };

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo href="/painel" />
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted sm:inline">{user.name}</span>
            <form action={logout}>
              <button className="btn btn-ghost py-1.5">Sair</button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
