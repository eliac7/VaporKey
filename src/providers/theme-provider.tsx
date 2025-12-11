"use client"
import { ThemeProvider as NextThemesProvider, useTheme, type ThemeProviderProps } from "next-themes"

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
            {children}
        </NextThemesProvider>
    )
}

export { ThemeProvider, useTheme }
