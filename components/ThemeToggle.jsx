"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="
                relative inline-flex items-center justify-center
                w-10 h-10 rounded-full
                bg-orange-50 dark:bg-stone-800
                border border-orange-200 dark:border-stone-700
                text-orange-500 dark:text-orange-400
                hover:bg-orange-100 dark:hover:bg-stone-700
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                dark:focus:ring-offset-stone-900
                shadow-sm hover:shadow-md
                theme-toggle
                cursor-pointer
            "
        >
            <span
                key={isDark ? "moon" : "sun"}
                className="animate-fade-in-up"
            >
                {isDark ? (
                    <Moon className="w-[18px] h-[18px]" />
                ) : (
                    <Sun className="w-[18px] h-[18px]" />
                )}
            </span>
        </button>
    );
}
