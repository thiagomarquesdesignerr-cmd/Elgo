import { NewPortalForm } from "./NewPortalForm";
import { ROOT_DOMAIN } from "@/lib/utils";

export default function NovoPortal() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Criar novo portal</h1>
      <p className="mt-1 mb-6 text-muted">Você pode mudar tudo isso depois.</p>
      <div className="rounded-xl border border-line bg-white p-6">
        <NewPortalForm rootDomain={ROOT_DOMAIN} />
      </div>
    </div>
  );
}
