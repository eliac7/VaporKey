import { Providers } from "@/app/providers";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeToggle } from "@/components/theme-toggle";
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { JetBrains_Mono } from "next/font/google";
import { notFound } from 'next/navigation';
import "../globals.css";
import { LanguageSelector } from "@/components/language-selector";

const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetBrainsMono",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata' });

    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
        title: t('title'),
        description: t('description'),
        icons: {
            icon: "/favicon.ico",
        },
        openGraph: {
            images: [
                {
                    url: "/og-image.jpg",
                },
            ],
        },
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!(routing.locales as readonly string[]).includes(locale)) {
        notFound();
    }

    const messages = await getMessages();

    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning>
            <body
                className={`${jetBrainsMono.variable} antialiased noise-bg`}
                suppressHydrationWarning
            >
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <Providers>
                        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
                            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 sm:top-6 sm:right-6">
                                <LanguageSelector />
                                <ThemeToggle />
                            </div>
                            <main className="flex-1 flex flex-col items-center justify-center px-4 md:py-20 pt-20 pb-0 mdsm:py-8">
                                <Header />
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

