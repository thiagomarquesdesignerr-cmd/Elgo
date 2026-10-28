import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Entrar — Elgo" };

export default function Page() {
  return (
    <>
      <h1 className="mb-5 text-xl font-bold">Entrar na sua redação</h1>
      <AuthForm mode="entrar" />
    </>
  );
}
