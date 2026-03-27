'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogActionsProvider } from '@/hooks/use-dialog-actions';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEditorStore } from '@/store/editor-store';
import { useThemePresetStore } from '@/third_party/tweakcn/store/theme-preset-store';
import { Theme, ThemeStyles } from '@/third_party/tweakcn/types/theme';
import { Sliders } from 'lucide-react';
import React, { use, useEffect } from 'react';
import { ActionBar } from './action-bar/components/action-bar';
import ThemeControlPanel from './theme-control-panel';
import ThemePreviewPanel from './theme-preview-panel';

interface EditorProps {
  themePromise: Promise<Theme | null>;
}

const isThemeStyles = (styles: unknown): styles is ThemeStyles => {
  return (
    !!styles &&
    typeof styles === 'object' &&
    styles !== null &&
    'light' in styles &&
    'dark' in styles
  );
};

const Editor: React.FC<EditorProps> = ({ themePromise }) => {
  const themeState = useEditorStore((state) => state.themeState);
  const setThemeState = useEditorStore((state) => state.setThemeState);
  const registerPreset = useThemePresetStore((state) => state.registerPreset);
  const isMobile = useIsMobile();

  const initialTheme = use(themePromise);

  const handleStyleChange = React.useCallback(
    (newStyles: ThemeStyles) => {
      const prev = useEditorStore.getState().themeState;
      setThemeState({ ...prev, styles: newStyles });
    },
    [setThemeState],
  );

  useEffect(() => {
    if (initialTheme && isThemeStyles(initialTheme.styles)) {
      registerPreset(initialTheme.id, {
        label: initialTheme.name,
        source: 'SAVED',
        styles: initialTheme.styles,
      });

      const prev = useEditorStore.getState().themeState;
      setThemeState({
        ...prev,
        styles: initialTheme.styles,
        preset: initialTheme.id,
      });
    }
  }, [initialTheme, registerPreset, setThemeState]);

  if (initialTheme && !isThemeStyles(initialTheme.styles)) {
    return (
      <div className="text-destructive flex h-full items-center justify-center">
        Fetched theme data is invalid.
      </div>
    );
  }

  const styles = themeState.styles;

  // Mobile layout
  if (isMobile) {
    return (
      <DialogActionsProvider>
        <div className="relative isolate flex flex-1 overflow-hidden">
          <div className="size-full flex-1 overflow-hidden">
            <Tabs defaultValue="controls" className="h-full">
              <TabsList className="w-full rounded-none">
                <TabsTrigger value="controls" className="flex-1">
                  <Sliders className="mr-2 h-4 w-4" />
                  Controls
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex-1">
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="controls"
                className="mt-0 h-[calc(100%-2.5rem)]"
              >
                <div className="flex h-full flex-col">
                  <ThemeControlPanel
                    styles={styles}
                    onChange={handleStyleChange}
                    currentMode={themeState.currentMode}
                  />
                </div>
              </TabsContent>
              <TabsContent
                value="preview"
                className="mt-0 h-[calc(100%-2.5rem)]"
              >
                <div className="flex h-full flex-col">
                  <ActionBar />
                  <ThemePreviewPanel
                    styles={styles}
                    currentMode={themeState.currentMode}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogActionsProvider>
    );
  }

  // Desktop layout
  return (
    <DialogActionsProvider>
      <div className="relative isolate flex flex-1 overflow-hidden">
        <div className="size-full flex min-h-0 w-full">
          <div className="min-w-[22rem] max-w-[40%] shrink-0 border-r">
            <div className="relative isolate flex h-full flex-1 flex-col overflow-hidden">
              <ThemeControlPanel
                styles={styles}
                onChange={handleStyleChange}
                currentMode={themeState.currentMode}
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex min-h-0 flex-1 flex-col">
                <ActionBar />
                <ThemePreviewPanel
                  styles={styles}
                  currentMode={themeState.currentMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogActionsProvider>
  );
};

export default Editor;
