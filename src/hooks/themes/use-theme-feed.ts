import { useCallback, useEffect, useMemo, useState } from "react";
import { getThemesPaginated } from "@/actions/themes";
import type { MyThemeResponse } from "@/types/my-theme";

export const themeFeedKeys = {
  all: ["theme-feed"] as const,
  list: () => [...themeFeedKeys.all, "list"] as const,
};

export function useThemeFeed() {
  const [pages, setPages] = useState<MyThemeResponse[]>([]);
  const [nextCursor, setNextCursor] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadFirstPage = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const page = await getThemesPaginated(undefined);
      setPages([page]);
      setNextCursor(page.nextCursor ?? null);
    } catch (err) {
      setPages([]);
      setNextCursor(null);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchNextPage = useCallback(async () => {
    if (!nextCursor || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    setError(null);

    try {
      const page = await getThemesPaginated(nextCursor);
      setPages((prev) => [...prev, page]);
      setNextCursor(page.nextCursor ?? null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [isFetchingNextPage, nextCursor]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const data = useMemo(() => ({ pages }), [pages]);

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage: nextCursor !== null,
    isFetchingNextPage,
    isLoading,
    refetch: loadFirstPage,
  };
}
