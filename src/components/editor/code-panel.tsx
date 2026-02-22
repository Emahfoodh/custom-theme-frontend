'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { ColorFormat } from '@/types';
import { usePreferencesStore } from '@/third_party/tweakcn/store/preferences-store';
import { ThemeEditorState } from '@/third_party/tweakcn/types/editor';
import {
  generateLayoutCode,
  generateThemeCode,
} from '@/third_party/tweakcn/utils/theme-style-generator';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CodePanelProps {
  themeEditorState: ThemeEditorState;
}

export default function CodePanel({ themeEditorState }: CodePanelProps) {
  const [activeTab, setActiveTab] = useState('index.css');

  const colorFormat = usePreferencesStore((state) => state.colorFormat);
  const setColorFormat = usePreferencesStore((state) => state.setColorFormat);
  const codeClipboard = useCopyToClipboard();
  const tailwindVersion = '4' as const;

  const code = generateThemeCode(themeEditorState, colorFormat, tailwindVersion);
  const layoutCode = generateLayoutCode(themeEditorState);

  const activeCode =
    activeTab === 'index.css'
      ? code
      : layoutCode;

  useEffect(() => {
    if (colorFormat !== 'hsl' && colorFormat !== 'oklch') {
      setColorFormat('oklch');
    }
  }, [colorFormat, setColorFormat]);

  const selectedColorFormat: ColorFormat =
    colorFormat === 'hsl' || colorFormat === 'oklch' ? colorFormat : 'oklch';

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex-none">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Theme Code</h2>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Select
          value={selectedColorFormat}
          onValueChange={(value: ColorFormat) => setColorFormat(value)}
        >
          <SelectTrigger className="bg-muted/50 w-fit gap-1 border-none shadow-none focus:border-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hsl">hsl</SelectItem>
            <SelectItem value="oklch">oklch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="index.css"
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border gap-0"
      >
        <div className="bg-muted/50 flex flex-none items-center justify-between border-b px-4 py-2">
          <TabsList className="h-8 bg-transparent p-0">
            <TabsTrigger value="index.css" className="h-7 px-3 text-sm font-medium">
              index.css
            </TabsTrigger>
            <TabsTrigger value="layout.tsx" className="h-7 px-3 text-sm font-medium">
              layout.tsx (Next.js)
            </TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void codeClipboard.copyToClipboard(activeCode);
            }}
            className="h-8"
            aria-label={
              codeClipboard.hasCopied ? 'Copied to clipboard' : 'Copy to clipboard'
            }
          >
            {codeClipboard.hasCopied ? (
              <>
                <Check className="size-4" />
                <span className="sr-only md:not-sr-only">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-4" />
                <span className="sr-only md:not-sr-only">Copy</span>
              </>
            )}
          </Button>
        </div>

        <TabsContent value="index.css" className="min-h-0 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <pre className="min-h-full p-4 font-mono text-sm leading-relaxed">
              <code>{code}</code>
            </pre>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="layout.tsx" className="min-h-0 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <pre className="min-h-full p-4 font-mono text-sm leading-relaxed">
              <code>{layoutCode}</code>
            </pre>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
