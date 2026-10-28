export const LAYOUTS = [
  { id: "classico", name: "Clássico", tagline: "Jornal tradicional, com manchete e coluna lateral." },
  { id: "feed", name: "Feed", tagline: "Estilo grandes portais: destaques e feed contínuo." },
  { id: "revista", name: "Revista", tagline: "Foto gigante com o título por cima." },
  { id: "plantao", name: "Plantão", tagline: "Linha do tempo com o horário de cada notícia." },
  { id: "coluna", name: "Coluna", tagline: "Uma coluna só, para opinião e blogs." },
] as const;

export type LayoutId = (typeof LAYOUTS)[number]["id"];

export function isLayout(value: unknown): value is LayoutId {
  return LAYOUTS.some((l) => l.id === value);
}
