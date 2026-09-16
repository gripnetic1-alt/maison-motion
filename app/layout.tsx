import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison Motion — Le mouvement donne de la valeur aux lieux",
  description: "Vidéo cinématique pour actifs premium à partir de vos photos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
