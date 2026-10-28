import { requirePortal } from "@/lib/auth";
import { ROOT_DOMAIN } from "@/lib/utils";
import { domainStatus } from "@/lib/vercel";
import { SettingsForm } from "./SettingsForm";

export default async function Configuracoes({ params }: { params: Promise<{ portalId: string }> }) {
  const { portalId } = await params;
  const { portal } = await requirePortal(portalId);
  const status = portal.customDomain ? await domainStatus(portal.customDomain) : null;
  return <SettingsForm portal={portal} rootDomain={ROOT_DOMAIN} domainStatus={status} />;
}
