import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Motion } from "@/components/site/Motion";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Paolo Pérez Ramos — Redactor creativo",
    template: "%s — Paolo Pérez Ramos",
  },
  description:
    "Portafolio de Paolo Pérez Ramos, redactor creativo en Publicis Impetu, Montevideo. Campañas para Pepsi, Pilsen, FIAT, Santander, Coca-Cola y más.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <Motion />
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
