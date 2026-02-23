/*
 * This file is part of tweakcn
 * Copyright (c) Sahaj J.
 * Licensed under the Apache License 2.0
 *
 * Modifications 2026:
 * - Code formatting adjustments
 * - Updated import paths to match project structure
 */

import { useCallback, useEffect, useState } from 'react';
import { getContrastRatio } from '../utils/contrast-checker';
import { debounce } from '../utils/debounce';

type ColorPair = {
  id: string;
  foreground: string;
  background: string;
};

type ContrastResult = {
  id: string;
  contrastRatio: number;
};

/**
 * Hook that calculates the contrast ratio between foreground and background colors for a list of pairs.
 * @param colorPairs - An array of color pairs, each with an id, foreground color, and background color.
 * @returns An array of objects, each containing the id and calculated contrast ratio for a pair.
 */
export function useContrastChecker(colorPairs: ColorPair[]) {
  const [contrastResults, setContrastResults] = useState<ContrastResult[]>([]);

  const debouncedCalculation = useCallback(
    debounce((pairs: ColorPair[]) => {
      if (!pairs.length) {
        setContrastResults([]);
        return;
      }

      try {
        const results = pairs.map((pair) => {
          const ratio = parseFloat(
            getContrastRatio(pair.foreground, pair.background),
          );
          return {
            id: pair.id,
            contrastRatio: ratio,
          };
        });

        setContrastResults(results);
      } catch (error) {
        console.error('Error checking contrast:', error);
        setContrastResults([]);
      }
    }, 750),
    [],
  );

  useEffect(() => {
    debouncedCalculation(colorPairs);
  }, [colorPairs, debouncedCalculation]);

  return contrastResults;
}
