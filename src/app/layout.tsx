import type { Metadata } from "next";
import { Inter, Source_Serif_4, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Elgo — hospedagem para portais de notícias",
  description: "Crie, publique e hospede seu portal de notícias em minutos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${serif.variable} ${display.variable}`}>
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
