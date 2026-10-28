import { requirePortal } from "@/lib/auth";
import { portalUrl } from "@/lib/utils";
import { isLayout } from "@/lib/layouts";
import { LayoutPicker } from "./LayoutPicker";

export default async function Aparencia({ params }: { params: Promise<{ portalId: string }> }) {
  const { portalId } = await params;
  const { portal } = await requirePortal(portalId);
  return (
    <LayoutPicker
      portalId={portal.id}
      siteUrl={portalUrl(portal)}
      current={isLayout(portal.layout) ? portal.layout : "classico"}
      color={portal.primaryColor}
    />
  );
}
