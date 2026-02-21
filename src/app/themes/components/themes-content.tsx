"use client";

import { useThemeFeed } from "@/hooks/themes";
import { useEffect, useRef } from "react";
import { Palette, Loader2 } from "lucide-react";
import { ThemeCard } from "./themes-theme-card";
import { Skeleton } from "@/components/ui/skeleton";

export function ThemesContent() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useThemeFeed();

  const themes = data?.pages.flatMap((page) => page.themes) ?? [];

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex-1">
      <div className="min-w-0 flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border/60 bg-card"
                >
                  <Skeleton className="h-48 rounded-none" />
                  <div className="flex items-center justify-between gap-3 border-t border-border/40 px-4 py-3">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : themes.length === 0 ? (
            <div className="py-32 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Palette className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {"No themes yet"}
              </h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                {"Be the first to save a theme. It will appear here for everyone."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                {themes.map((theme) => (
                  <ThemeCard key={theme.id} theme={theme} />
                ))}
              </div>

              <div ref={sentinelRef} className="flex justify-center py-8">
                {isFetchingNextPage && (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
