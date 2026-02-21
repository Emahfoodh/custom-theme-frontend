"use client";

import Link from "next/link";
import type { MyTheme } from "@/types/my-theme";
import { useTheme } from "@/third_party/tweakcn/components/theme-provider";
import { ThemePreview } from "@/components/theme-preview";
import { ArrowUpRight } from "lucide-react";

interface ThemeCardProps {
  theme: MyTheme;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const { theme: currentTheme } = useTheme();

  const publishedDate = new Date(theme.publishedAt).toLocaleDateString(
    "en-US",
    { day: "numeric", month: "short", year: "numeric" }
  );

  return (
    <Link href={`/themes/${theme.themeId}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 group-hover:border-foreground/15 group-hover:shadow-lg">
        {/* Preview area */}
        <div className="relative h-48 w-full overflow-hidden">
          <ThemePreview
            styles={theme.styles[currentTheme]}
            name={theme.name}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          <span className="absolute right-3 bottom-3 z-10 text-xs text-muted-foreground">
            {publishedDate}
          </span>
          {/* Hover overlay with arrow */}
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/0 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:bg-foreground/10 group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4 text-foreground" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
