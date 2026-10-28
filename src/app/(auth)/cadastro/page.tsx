import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Criar conta — Elgo" };

export default function Page() {
  return (
    <>
      <h1 className="mb-1 text-xl font-bold">Crie seu portal de notícias</h1>
      <p className="mb-5 text-sm text-muted">Grátis para começar. Sem cartão de crédito.</p>
      <AuthForm mode="cadastro" />
    </>
  );
}
