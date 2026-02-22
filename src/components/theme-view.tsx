'use client';

import { Button } from '@/components/ui/button';
import { Theme } from '@/db/schema/theme';
import { useEditorStore } from '@/third_party/tweakcn/store/editor-store';
import { Calendar, Edit } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CodeButton } from './editor/action-bar/components/code-button';
import ThemePreviewPanel from './editor/theme-preview-panel';
import { ThemeToggle } from './theme-toggle';

interface ThemePublishData {
  themeId: string;
  publishedAt: string;
}

interface ThemeViewProps {
  theme: Theme;
  themePublishData?: ThemePublishData | null;
}

export default function ThemeView({ theme, themePublishData }: ThemeViewProps) {
  const {
    themeState,
    setThemeState,
    saveThemeCheckpoint,
    restoreThemeCheckpoint,
  } = useEditorStore();
  const router = useRouter();
  const currentMode = themeState.currentMode;
  const [codePanelOpen, setCodePanelOpen] = useState(false);

  useEffect(() => {
    saveThemeCheckpoint();
    setThemeState({
      ...themeState,
      styles: theme.styles,
    });
    return () => {
      restoreThemeCheckpoint();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, saveThemeCheckpoint, setThemeState, restoreThemeCheckpoint]);

  if (!theme) {
    notFound();
  }

  const toggleTheme = () => {
    setThemeState({
      ...themeState,
      currentMode: currentMode === 'light' ? 'dark' : 'light',
    });
  };

  const handleOpenInEditor = () => {
    setThemeState({
      ...themeState,
      styles: theme.styles,
    });
    saveThemeCheckpoint();
    router.push('/editor/theme');
  };

  const publishedAt = themePublishData?.publishedAt;
  const publishedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">{theme.name}</h1>
            {publishedDate && (
              <>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>{publishedDate}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <ThemeToggle />
            <CodeButton
              variant="outline"
              size="default"
              onClick={() => setCodePanelOpen(true)}
            />
            <Button
              variant="outline"
              size="default"
              onClick={handleOpenInEditor}
            >
              <Edit className="size-4" />
              Open in Editor
            </Button>
          </div>
        </div>
      </div>

      <div className="-m-4 mt-6 flex h-[min(80svh,900px)] flex-col">
        <ThemePreviewPanel styles={theme.styles} currentMode={currentMode} />
      </div>
    </>
  );
}
