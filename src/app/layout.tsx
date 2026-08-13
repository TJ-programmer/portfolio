import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Tarun J | Gotham AI Developer",
  description:
    "A Batman-inspired portfolio for Tarun J, an AI end-to-end developer building from data and models to deployed products.",
  openGraph: {
    title: "Tarun J | Gotham AI Developer",
    description:
      "Noir, cinematic AI portfolio featuring projects across data, models, deployment, and product interfaces.",
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
      <body>{children}</body>
    </html>
  );
}
