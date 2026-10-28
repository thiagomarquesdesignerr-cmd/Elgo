export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-6xl font-bold">404</p>
        <p className="mt-2 text-muted">Esta página não existe ou foi removida.</p>
        <a href="/" className="btn btn-ghost mt-6">Voltar ao início</a>
      </div>
    </main>
  );
}
