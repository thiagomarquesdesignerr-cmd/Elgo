import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo />
        </div>
        <div className="rounded-xl border border-line bg-white p-6 shadow-sm">{children}</div>
      </div>
    </main>
  );
}
