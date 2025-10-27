import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
// Script não é mais necessário aqui se removemos o Analytics
// import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

// Metadata apenas para SEO agora
export const metadata: Metadata = {
  title: "LIT - Life. Improved. Together.",
  description: "The Gamified Productivity Superapp.",
  // A verificação do AdSense será feita pela tag <meta> no <head>
};

// GA_MEASUREMENT_ID removido

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          {/* Adiciona a Meta Tag do AdSense diretamente no head */}
          <meta name="google-adsense-account" content="ca-pub-7328591460493456" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics/>
      </body>
    </html>
  );
}

