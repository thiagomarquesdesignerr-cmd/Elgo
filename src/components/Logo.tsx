import Link from "next/link";

// Símbolo Elgo · Pulso: "e" em quadrado azul com o ponto verde de "no ar".
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <rect width="56" height="56" rx="14" fill="#2F5BFF" />
      <text x="28" y="38" textAnchor="middle" fontFamily="var(--font-space-grotesk)" fontWeight="700" fontSize="32" fill="#fff">
        e
      </text>
      <circle cx="44" cy="12" r="5" fill="#B8FF3B" />
    </svg>
  );
}

export function Logo({ href = "/", size = 28 }: { href?: string; size?: number }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 font-display font-bold tracking-tight" style={{ fontSize: size * 0.85 }}>
      <LogoMark size={size} />
      elgo
    </Link>
  );
}
