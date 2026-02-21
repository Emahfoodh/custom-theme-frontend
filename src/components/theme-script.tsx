import {
  defaultDarkThemeStyles,
  defaultLightThemeStyles,
} from '@/third_party/tweakcn/config/theme';

const STORAGE_KEY = 'editor-storage';

function buildThemeInitScript(
  lightStyles: typeof defaultLightThemeStyles,
  darkStyles: typeof defaultDarkThemeStyles,
) {
  function initializeTheme(
    defaultLightStyles: Record<string, string>,
    defaultDarkStyles: Record<string, string>,
    storageKey: string,
  ) {
    type ThemeState = {
      currentMode?: 'dark' | 'light';
      styles?: {
        dark?: Record<string, string>;
        light?: Record<string, string>;
      };
    };

    const DEFAULT_FONT_WEIGHTS = ['400'];

    function extractFontFamily(fontFamilyValue: string | undefined) {
      if (!fontFamilyValue) return null;
      const firstFont = fontFamilyValue.split(',')[0].trim();
      const cleanFont = firstFont.replace(/['"]/g, '');
      const systemFonts = [
        'ui-sans-serif',
        'ui-serif',
        'ui-monospace',
        'system-ui',
        'sans-serif',
        'serif',
        'monospace',
        'cursive',
        'fantasy',
      ];
      if (systemFonts.includes(cleanFont.toLowerCase())) return null;
      return cleanFont;
    }

    function buildFontCssUrl(family: string, weights?: string[]) {
      const effectiveWeights = weights || DEFAULT_FONT_WEIGHTS;
      const encodedFamily = encodeURIComponent(family);
      const weightsParam = effectiveWeights.join(';');
      return `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightsParam}&display=swap`;
    }

    function loadGoogleFont(family: string, weights?: string[]) {
      const href = buildFontCssUrl(family, weights);
      const existing = document.querySelector(`link[href="${href}"]`);
      if (existing) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }

    const root = document.documentElement;
    let themeState: ThemeState | null = null;

    try {
      const persistedStateJSON = localStorage.getItem(storageKey);
      if (persistedStateJSON) {
        themeState = JSON.parse(persistedStateJSON)?.state?.themeState;
      }
    } catch (e) {
      console.warn(
        'Theme initialization: Failed to read/parse localStorage:',
        e,
      );
    }

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const mode = themeState?.currentMode ?? (prefersDark ? 'dark' : 'light');

    const activeStyles =
      mode === 'dark'
        ? themeState?.styles?.dark || defaultDarkStyles
        : themeState?.styles?.light || defaultLightStyles;

    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const stylesToApply = Object.keys(defaultLightStyles);
    for (const styleName of stylesToApply) {
      const value = activeStyles[styleName];
      if (value !== undefined) {
        root.style.setProperty(`--${styleName}`, value);
      }
    }

    try {
      const currentFonts = {
        sans: activeStyles?.['font-sans'],
        serif: activeStyles?.['font-serif'],
        mono: activeStyles?.['font-mono'],
      };

      Object.values(currentFonts).forEach((fontValue) => {
        const fontFamily = extractFontFamily(fontValue);
        if (fontFamily) {
          loadGoogleFont(fontFamily, DEFAULT_FONT_WEIGHTS);
        }
      });
    } catch (e) {
      console.warn(
        'Theme Script initialization: Failed to load Google fonts:',
        e,
      );
    }
  }

  return `(${initializeTheme.toString()})(${JSON.stringify(lightStyles)}, ${JSON.stringify(darkStyles)}, ${JSON.stringify(STORAGE_KEY)});`;
}

export function ThemeScript() {
  const scriptContent = buildThemeInitScript(
    defaultLightThemeStyles,
    defaultDarkThemeStyles,
  );

  return (
    <script
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      suppressHydrationWarning
    />
  );
}
