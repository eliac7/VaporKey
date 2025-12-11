import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";

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
        <Providers>
          <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="absolute top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            <Header />
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
