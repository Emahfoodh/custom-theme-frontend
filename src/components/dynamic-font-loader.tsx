'use client';

import { useEditorStore } from '@/store/editor-store';
import {
  extractFontFamily,
  getDefaultWeights,
} from '@/third_party/tweakcn/utils/fonts';
import { loadGoogleFont } from '@/third_party/tweakcn/utils/fonts/google-fonts';
import { useEffect, useMemo } from 'react';

export function DynamicFontLoader() {
  const { themeState } = useEditorStore();

  const fontSans = themeState.styles.light['font-sans'];
  const fontSerif = themeState.styles.light['font-serif'];
  const fontMono = themeState.styles.light['font-mono'];

  const currentFonts = useMemo(
    () =>
      ({
        sans: fontSans,
        serif: fontSerif,
        mono: fontMono,
      }) as const,
    [fontSans, fontSerif, fontMono],
  );

  useEffect(() => {
    try {
      Object.values(currentFonts).forEach((fontValue) => {
        const fontFamily = extractFontFamily(fontValue);
        if (fontFamily) {
          const weights = getDefaultWeights(['400', '500', '600', '700']);
          loadGoogleFont(fontFamily, weights);
        }
      });
    } catch (error) {
      console.warn('DynamicFontLoader: Failed to load Google fonts:', error);
    }
  }, [currentFonts]);

  return null;
}
