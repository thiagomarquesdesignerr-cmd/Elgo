"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PortalTabs({ portalId }: { portalId: string }) {
  const pathname = usePathname();
  const base = `/painel/${portalId}`;
  const tabs = [
    { href: base, label: "Matérias", active: pathname === base || pathname.startsWith(`${base}/materias`) },
    { href: `${base}/editorias`, label: "Editorias", active: pathname.startsWith(`${base}/editorias`) },
    { href: `${base}/aparencia`, label: "Aparência", active: pathname.startsWith(`${base}/aparencia`) },
    { href: `${base}/configuracoes`, label: "Configurações", active: pathname.startsWith(`${base}/configuracoes`) },
  ];

  return (
    <nav className="flex gap-1 border-b border-line">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
            t.active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
