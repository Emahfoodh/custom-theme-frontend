import { ThemeStyles } from '@/third_party/tweakcn/types/theme';

export interface MyTheme {
  id: string;
  themeId: string;
  name: string;
  styles: ThemeStyles;
  publishedAt: string;
}

export interface MyThemeResponse {
  themes: MyTheme[];
  nextCursor: string | number | null;
}
