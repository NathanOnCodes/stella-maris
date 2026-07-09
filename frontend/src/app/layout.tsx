import type { Metadata } from "next";
import { Libre_Bodoni, Libre_Baskerville, Public_Sans } from "next/font/google";
import { SerwistProviderWrapper } from "@/components/serwist-provider-wrapper";
import "./globals.css";

const display = Libre_Bodoni({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const leitura = Libre_Baskerville({
  variable: "--font-leitura",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ui = Public_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s — Vox Regina Caeli",
    default: "Vox Regina Caeli — Revista Católica Independente",
  },
  description:
    "Revista digital católica independente com conteúdo editorial sobre notícias da Igreja, espiritualidade, apologética e entrevistas.",
  openGraph: {
    title: "Vox Regina Caeli",
    description:
      "Revista digital católica independente com conteúdo editorial sobre notícias da Igreja, espiritualidade, apologética e entrevistas.",
    siteName: "Vox Regina Caeli",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${leitura.variable} ${ui.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SerwistProviderWrapper>{children}</SerwistProviderWrapper>
      </body>
    </html>
  );
}
