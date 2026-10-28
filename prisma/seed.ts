// Dados de demonstração: um usuário de teste e o portal fictício "Diário do Vale".
// Login de teste: demo@elgo.test / demo12345
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const cover = (seed: string) => `https://picsum.photos/seed/${seed}/1200/675`;

const body = (lead: string) => `${lead}

A informação foi confirmada pela reportagem do **Diário do Vale** na manhã desta quarta-feira. Segundo fontes ouvidas, a expectativa é que os primeiros resultados apareçam já nas próximas semanas.

## O que muda na prática

Moradores dos bairros afetados devem acompanhar os comunicados oficiais. A prefeitura informou que vai divulgar um calendário completo nos canais da cidade.

> "É um passo importante para Vale Verde, e a população vai sentir a diferença no dia a dia", disse um dos responsáveis pelo projeto.

## Próximos passos

- Audiência pública marcada para o fim do mês
- Cadastro dos interessados pelo site da prefeitura
- Balanço parcial previsto para dezembro

O Diário do Vale segue acompanhando o caso e atualiza esta matéria assim que houver novidades.`;

const articles: { title: string; summary: string; cat: string; img: string; featured?: boolean; hoursAgo: number; views: number }[] = [
  { title: "Prefeitura de Vale Verde anuncia nova linha de ônibus ligando o centro aos bairros da zona norte", summary: "Linha 210 começa a circular em novembro com 14 veículos e tarifa integrada.", cat: "Cidades", img: "bus", featured: true, hoursAgo: 1, views: 1840 },
  { title: "Câmara aprova orçamento de 2027 com aumento de 12% para a saúde", summary: "Texto segue para sanção do prefeito; oposição critica corte em obras viárias.", cat: "Política", img: "council", featured: true, hoursAgo: 3, views: 960 },
  { title: "Vale Verde FC vence clássico regional e assume a liderança do estadual", summary: "Gol de cabeça aos 44 do segundo tempo decidiu a partida diante de 18 mil torcedores.", cat: "Esportes", img: "stadium", featured: true, hoursAgo: 5, views: 3120 },
  { title: "Feira de produtores rurais volta à praça central neste fim de semana", summary: "Evento reúne 60 expositores e terá programação musical gratuita.", cat: "Cultura", img: "market", hoursAgo: 7, views: 540 },
  { title: "Comércio local projeta alta de 8% nas vendas de fim de ano", summary: "Associação comercial aposta em contratações temporárias e horário estendido.", cat: "Economia", img: "shop", hoursAgo: 9, views: 410 },
  { title: "Obras na ponte do Rio Claro devem terminar antes do previsto", summary: "Estrutura será liberada para veículos leves já na primeira semana de dezembro.", cat: "Cidades", img: "bridge", hoursAgo: 13, views: 1220 },
  { title: "Festival de cinema independente abre inscrições para curtas da região", summary: "Mostra competitiva vai premiar produções com até 20 minutos.", cat: "Cultura", img: "cinema", hoursAgo: 20, views: 300 },
  { title: "Nova fábrica de embalagens deve gerar 400 empregos diretos", summary: "Investimento de R$ 90 milhões foi anunciado em evento com empresários.", cat: "Economia", img: "factory", hoursAgo: 26, views: 2050 },
  { title: "Vereadores criam comissão para acompanhar contrato do lixo", summary: "Grupo terá 90 dias para analisar reajustes e qualidade do serviço.", cat: "Política", img: "papers", hoursAgo: 31, views: 270 },
  { title: "Atleta de Vale Verde é convocada para a seleção brasileira de vôlei", summary: "Levantadora de 19 anos começou no projeto social do ginásio municipal.", cat: "Esportes", img: "volley", hoursAgo: 40, views: 2700 },
  { title: "Parque municipal ganha trilha acessível e novo mirante", summary: "Percurso de 1,2 km foi adaptado para cadeirantes e pessoas com mobilidade reduzida.", cat: "Cidades", img: "park", hoursAgo: 52, views: 680 },
];

async function main() {
  // Recomeça do zero: remove o portal e o usuário de exemplo, se já existirem.
  await db.portal.deleteMany({ where: { slug: "diariodovale" } });
  await db.user.deleteMany({ where: { email: "demo@elgo.test" } });
  const user = await db.user.create({
    data: { name: "Ana Redatora", email: "demo@elgo.test", passwordHash: await bcrypt.hash("demo12345", 10) },
  });

  const portal = await db.portal.create({
    data: {
      name: "Diário do Vale",
      slug: "diariodovale",
      description: "Notícias de Vale Verde e região",
      primaryColor: "#0b5394",
      ownerId: user.id,
      categories: {
        create: ["Cidades", "Política", "Economia", "Esportes", "Cultura"].map((name, position) => ({
          name, slug: slugify(name), position,
        })),
      },
    },
    include: { categories: true },
  });

  for (const a of articles) {
    const publishedAt = new Date(Date.now() - a.hoursAgo * 3600_000);
    await db.article.create({
      data: {
        portalId: portal.id,
        title: a.title,
        slug: slugify(a.title),
        summary: a.summary,
        body: body(a.summary),
        coverUrl: cover(a.img),
        author: "Ana Redatora",
        status: "publicado",
        featured: a.featured ?? false,
        views: a.views,
        publishedAt,
        createdAt: publishedAt,
        updatedAt: publishedAt,
        categoryId: portal.categories.find((c) => c.name === a.cat)!.id,
      },
    });
  }

  await db.article.create({
    data: { portalId: portal.id, title: "Rascunho: entrevista com o secretário de educação", slug: "rascunho-entrevista", author: "Ana Redatora" },
  });

  console.log(`Seed ok → http://diariodovale.localhost:3000  ·  login demo@elgo.test / demo12345`);
}

main().finally(() => db.$disconnect());
