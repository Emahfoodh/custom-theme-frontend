"use client";

import { useThemeFeed } from "@/hooks/themes";
import { useEffect, useRef } from "react";
import { Flame, Loader2 } from "lucide-react";
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
        <div className="space-y-6 p-4">
          {isLoading ? (
            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="space-y-0 overflow-hidden rounded-xl border"
                >
                  <Skeleton className="h-36 rounded-none" />
                  <div className="space-y-2 p-3">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : themes.length === 0 ? (
            <div className="py-24 text-center">
              <div className="bg-muted mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
                <Flame className="text-muted-foreground size-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No themes yet</h3>
                <p className="text-muted-foreground mx-auto max-w-sm">
                  Be the first to save a theme. It will appear here for everyone.
                </p>
              </div>
          ) : (
            <>
              <div className="grid gap-5 gap-y-8 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                {themes.map((theme) => (
                  <ThemeCard key={theme.id} theme={theme} />
                ))}
              </div>

              <div ref={sentinelRef} className="flex justify-center pt-4">
                {isFetchingNextPage && (
                  <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
