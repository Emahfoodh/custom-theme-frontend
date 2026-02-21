import { useCallback, useEffect, useState } from "react";
import { getThemes, getTheme } from "@/actions/themes";
import { Theme } from "@/third_party/tweakcn/types/theme";

export type ThemeWithPublished = Awaited<ReturnType<typeof getThemes>>[number];

export const themeKeys = {
  all: ["themes"] as const,
  lists: () => [...themeKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...themeKeys.lists(), { filters }] as const,
  details: () => [...themeKeys.all, "detail"] as const,
  detail: (id: string) => [...themeKeys.details(), { id }] as const,
};

export function useThemesData(initialData?: ThemeWithPublished[]) {
  const [data, setData] = useState<ThemeWithPublished[] | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const themes = await getThemes();
      setData(themes);
      return themes;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialData) {
      void refetch();
    }
  }, [initialData, refetch]);

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}

export function useThemeData(themeId: string | null, initialData?: Theme) {
  const [data, setData] = useState<Theme | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(Boolean(themeId) && !initialData);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!themeId) {
      setData(undefined);
      return undefined;
    }

    setIsLoading(true);
    setError(null);

    try {
      const theme = await getTheme(themeId);
      setData(theme);
      return theme;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [themeId]);

  useEffect(() => {
    if (themeId && !initialData) {
      void refetch();
    }
  }, [themeId, initialData, refetch]);

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}

export function usePrefetchThemes() {
  return useCallback(async (themeIds: string[]) => {
    await Promise.allSettled(themeIds.map((id) => getTheme(id)));
  }, []);
}
