'use client';

import { ThemePreview } from '@/components/theme-preview';
import { useTheme } from '@/third_party/tweakcn/components/theme-provider';
import type { ThemeStyles } from '@/third_party/tweakcn/types/theme';

interface ThemeDetailPreviewProps {
  name: string;
  styles: ThemeStyles;
}

export function ThemeDetailPreview({ name, styles }: ThemeDetailPreviewProps) {
  const { theme } = useTheme();

  return <ThemePreview styles={styles[theme]} name={name} />;
}
