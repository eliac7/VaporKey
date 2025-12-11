"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setTimeout(() => {
            setMounted(true)
        }, 100)
    }, [])

    const cycleTheme = () => {
        if (theme === "light") setTheme("dark")
        else if (theme === "dark") setTheme("system")
        else setTheme("light")
    }

    if (!mounted) {
        return (
            <button
                className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800"
                aria-label="Toggle theme"
            >
                <div className="w-5 h-5" />
            </button>
        )
    }

    return (
        <button
            onClick={cycleTheme}
            className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-900/50 hover:bg-zinc-300 dark:hover:bg-zinc-900/70 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors border border-zinc-300 dark:border-zinc-800"
            aria-label="Toggle theme"
        >
            {theme === "system" && <Monitor className="w-5 h-5" />}
            {theme === "light" && <Sun className="w-5 h-5" />}
            {theme === "dark" && <Moon className="w-5 h-5" />}
        </button>
    )
}
