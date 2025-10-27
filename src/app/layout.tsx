import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script'; // Importar o Script

const inter = Inter({ subsets: ["latin"] });

// Metadata para SEO e a verificação do AdSense
export const metadata: Metadata = {
  title: "LIT - Life. Improved. Together.",
  description: "The Gamified Productivity Superapp.",
  // Cole a SUA Meta Tag do AdSense aqui (se for usar este método)
  other: {
    // Exemplo - SUBSTITUA PELO SEU CÓDIGO REAL:
    'google-adsense-account': '7328591460493456',
  },
};

// Substitua pelo seu ID de Métrica do Google Analytics 4
const GA_MEASUREMENT_ID = '7328591460493456'; // <-- COLOQUE SEU ID AQUI

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* A Meta Tag do AdSense também pode ir aqui diretamente se preferir */}
      {/* <head>
          <meta name="google-adsense-account" content="7328591460493456" />
      </head> */}
      <body className={inter.className}>
        {children}

        {/* Google Analytics Scripts */}
        {/* Carrega a biblioteca gtag.js */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive" // Carrega depois da página ficar interativa
        />
        {/* Inicializa o gtag e envia o pageview inicial */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
