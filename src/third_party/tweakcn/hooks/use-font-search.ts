/*
 * This file is part of tweakcn
 * Copyright (c) Sahaj J.
 * Licensed under the Apache License 2.0
 *
 * Modifications 2026:
 * - Code formatting adjustments
 * - Updated import paths to match project structure
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { FontCategory, PaginatedFontsResponse } from '../types/fonts';

export type FilterFontCategory = 'all' | FontCategory;

interface UseFontSearchParams {
  query: string;
  category?: FilterFontCategory;
  limit?: number;
  enabled?: boolean;
}

// Simple in-memory cache keyed by query+category
const cache = new Map<string, PaginatedFontsResponse[]>();

function cacheKey(query: string, category: string) {
  return `${query}::${category}`;
}

async function fetchPage(
  query: string,
  category: string,
  limit: number,
  offset: number,
): Promise<PaginatedFontsResponse> {
  const searchParams = new URLSearchParams({
    q: query,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (category && category !== 'all') {
    searchParams.append('category', category);
  }

  const response = await fetch(`/api/google-fonts?${searchParams}`);

  if (!response.ok) {
    throw new Error('Failed to fetch fonts');
  }

  return response.json() as Promise<PaginatedFontsResponse>;
}

export function useFontSearch({
  query,
  category = 'all',
  limit = 20,
  enabled = true,
}: UseFontSearchParams) {
  const [pages, setPages] = useState<PaginatedFontsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Track the current query+category so stale fetches can be ignored
  const activeKey = useRef('');

  // Reset and fetch the first page when query/category/enabled changes
  useEffect(() => {
    const key = cacheKey(query, category);
    activeKey.current = key;

    if (!enabled) {
      setPages([]);
      setHasNextPage(false);
      return;
    }

    // Use cached data if available
    const cached = cache.get(key);
    if (cached) {
      setPages(cached);
      const last = cached[cached.length - 1];
      setHasNextPage(last?.hasMore ?? false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setPages([]);
    setHasNextPage(false);

    fetchPage(query, category, limit, 0)
      .then((page) => {
        if (cancelled || activeKey.current !== key) return;
        const newPages = [page];
        setPages(newPages);
        setHasNextPage(page.hasMore ?? false);
        cache.set(key, newPages);
      })
      .catch((err) => {
        if (!cancelled) console.error('Font search failed:', err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, category, limit, enabled]);

  const fetchNextPage = useCallback(() => {
    const key = cacheKey(query, category);
    if (!hasNextPage || isFetchingNextPage) return;

    const lastPage = pages[pages.length - 1];
    if (!lastPage) return;

    const nextOffset = lastPage.offset + lastPage.limit;

    setIsFetchingNextPage(true);

    fetchPage(query, category, limit, nextOffset)
      .then((page) => {
        if (activeKey.current !== key) return;
        setPages((prev) => {
          const updated = [...prev, page];
          cache.set(key, updated);
          return updated;
        });
        setHasNextPage(page.hasMore ?? false);
      })
      .catch((err) => console.error('Font search next page failed:', err))
      .finally(() => setIsFetchingNextPage(false));
  }, [query, category, limit, pages, hasNextPage, isFetchingNextPage]);

  // Return shape compatible with what font-picker.tsx expects
  return {
    data: pages.length > 0 ? { pages } : undefined,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}
