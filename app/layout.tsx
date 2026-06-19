import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SECURE PAYLOAD ENCLOSED // CLASSIFIED",
  description:
    "⚠ CLASSIFIED — A secure, encrypted payload has been prepared for your eyes only. Identity verification required. Do not share this link.",
  openGraph: {
    title: "🔐 SECURE PAYLOAD ENCLOSED // CLASSIFIED",
    description:
      "⚠ CLASSIFIED — A secure, encrypted payload has been prepared for your eyes only. Identity verification required.",
    type: "website",
    siteName: "Midnight Decryption Vault",
  },
  twitter: {
    card: "summary",
    title: "🔐 SECURE PAYLOAD ENCLOSED // CLASSIFIED",
    description:
      "⚠ CLASSIFIED — A secure, encrypted payload has been prepared for your eyes only. Identity verification required.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${firaCode.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
