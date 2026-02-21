"use client";

import Link from "next/link";
import type { MyTheme } from "@/types/my-theme";
import { useTheme } from "@/third_party/tweakcn/components/theme-provider";
import { ThemePreview } from "@/components/theme-preview";

interface ThemeCardProps {
  theme: MyTheme;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const { theme: currentTheme } = useTheme();

  const publishedDate = new Date(theme.publishedAt).toLocaleDateString(
    "en-US",
    { day: "numeric", month: "short" }
  );

  return (
    <Link href={`/themes/${theme.themeId}`} className="group">
      <div className="relative h-44 w-full overflow-hidden rounded-xl border shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-foreground/20">
        <ThemePreview
          styles={theme.styles[currentTheme]}
          name={theme.name}
          className="transition-transform duration-300 group-hover:scale-102"
        />
      </div>

      <div className="flex items-start justify-between gap-2 px-1 pt-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{theme.name}</p>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-xs text-muted-foreground/60">
              {publishedDate}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
