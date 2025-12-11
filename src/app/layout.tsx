import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import Header from "@/components/header";
import Footer from "@/components/footer";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetBrainsMono",
});

export const metadata: Metadata = {
  title: "VaporKey - Secure Ephemeral Credential Sharing",
  description: "Share secrets securely with self-destructing one-time links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetBrainsMono.variable} antialiased noise-bg`}
        suppressHydrationWarning
      >
        <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-950">
          <Header />
          <Providers>{children}</Providers>
          <Footer />
        </main>
      </body>
    </html>
  );
}
