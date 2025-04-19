import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Organizador de Agenda TDAH",
  description: "Organize seu dia de forma simples e eficiente, especialmente desenvolvido para pessoas com TDAH.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Providers>
          <header className="bg-[var(--card-color)] shadow-[var(--shadow)] py-4 mb-6">
            <div className="container flex justify-between items-center">
              <h1 className="text-xl font-semibold mb-0">Organizador de Agenda TDAH</h1>
              <div className="flex gap-4">
                {/* Botões de navegação e controle de usuário serão adicionados aqui */}
              </div>
            </div>
          </header>
          {children}
          <footer className="text-center py-6 text-[var(--text-light)] text-sm">
            <div className="container">
              <p className="mb-0">Agente de Organização de Agenda para TDAH &copy; 2025</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
