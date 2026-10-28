"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup } from "@/app/actions/auth";

export function AuthForm({ mode }: { mode: "entrar" | "cadastro" }) {
  const [state, action, pending] = useActionState(mode === "entrar" ? login : signup, undefined);

  return (
    <form action={action} className="space-y-4">
      {mode === "cadastro" && (
        <div>
          <label className="label" htmlFor="name">Seu nome</label>
          <input className="field" id="name" name="name" autoComplete="name" required />
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">E-mail</label>
        <input className="field" id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <label className="label" htmlFor="password">Senha</label>
        <input
          className="field"
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "entrar" ? "current-password" : "new-password"}
          minLength={8}
          required
        />
      </div>
      {state?.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Aguarde…" : mode === "entrar" ? "Entrar" : "Criar conta grátis"}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === "entrar" ? (
          <>Ainda não tem conta? <Link className="font-semibold text-ink underline" href="/cadastro">Criar conta</Link></>
        ) : (
          <>Já tem conta? <Link className="font-semibold text-ink underline" href="/entrar">Entrar</Link></>
        )}
      </p>
    </form>
  );
}
