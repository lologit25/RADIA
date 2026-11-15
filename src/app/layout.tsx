import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cursor } from "@/components/site/Cursor";
import { InkClicks } from "@/components/site/InkClicks";
import { Loader } from "@/components/site/Loader";
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
    "Portafolio de Paolo Pérez Ramos, redactor creativo en Publicis Ímpetu, Montevideo. Campañas para Pepsi, Pilsen, FIAT, Tigo Paraguay, INAVI y Bagno & Company.",
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
            __html:
              "document.documentElement.classList.add('js');try{var l=localStorage.getItem('lang');if(l==='en'||l==='es')document.documentElement.lang=l}catch(e){}",
          }}
        />
      </head>
      <body>
        <div className="progress" data-progress aria-hidden="true" />
        <Motion />
        {children}
        <InkClicks />
        <Cursor />
        <Loader />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
