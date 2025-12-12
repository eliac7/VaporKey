"use client";

import { useTransition, useState, useEffect, useRef, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { Globe, ChevronDown } from "lucide-react";

export function LanguageSelector() {
    const t = useTranslations("language");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const onSelectChange = useCallback((newLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        });
        setIsOpen(false);
    }, [router, pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="flex items-center gap-2 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            >
                <Globe className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                <span className="uppercase font-semibold tracking-wide">{locale}</span>
                <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-lg py-1 min-w-[180px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {routing.locales.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => onSelectChange(loc)}
                            disabled={isPending}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${locale === loc
                                ? "text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/20"
                                : "text-zinc-900 dark:text-zinc-100"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{t(loc)}</span>
                                {locale === loc && (
                                    <span className="text-emerald-600 dark:text-emerald-400">
                                        ✓
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

