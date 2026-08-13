import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tarun J | AI End-to-End Developer",
  description:
    "Batman-inspired portfolio for Tarun J, an AI end-to-end developer building from data and models to deployed products.",
  openGraph: {
    title: "Tarun J | AI End-to-End Developer",
    description:
      "Noir, cinematic AI portfolio featuring real projects across data, models, deployment, and product interfaces.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
