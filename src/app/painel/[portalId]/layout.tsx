import Link from "next/link";
import { requirePortal } from "@/lib/auth";
import { portalUrl } from "@/lib/utils";
import { PortalTabs } from "./PortalTabs";

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ portalId: string }>;
}) {
  const { portalId } = await params;
  const { portal } = await requirePortal(portalId);

  return (
    <>
      <div className="mb-2 text-sm">
        <Link href="/painel" className="text-muted hover:text-ink">← Seus portais</Link>
      </div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{portal.name}</h1>
          <a href={portalUrl(portal)} target="_blank" className="text-sm text-muted hover:text-ink">
            {portalUrl(portal).replace(/^https?:\/\//, "")} ↗
          </a>
        </div>
        <Link href={`/painel/${portal.id}/materias/nova`} className="btn btn-primary">+ Nova matéria</Link>
      </div>
      <PortalTabs portalId={portal.id} />
      <div className="mt-6">{children}</div>
    </>
  );
}
