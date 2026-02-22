'use client';

import { HorizontalScrollArea } from '@/components/horizontal-scroll-area';
import { ThemeToggle } from '@/components/theme-toggle';
import { TooltipWrapper } from '@/components/tooltip-wrapper';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { cn } from '@/lib/utils';
import { ThemeEditorPreviewProps } from '@/third_party/tweakcn/types/theme';
import { Maximize, Minimize } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { lazy } from 'react';
import ColorPreview from './theme-preview/color-preview';
import ExamplesPreviewContainer from './theme-preview/examples-preview-container';
import TabsTriggerPill from './theme-preview/tabs-trigger-pill';

const DemoCards = lazy(() => import('@/components/cards/cards-demo'));
const DemoDashboard = lazy(() => import('@/components/dashboard/demo'));
const TypographyDemo = lazy(
  () => import('@/components/typography/typography-demo'),
);

const ThemePreviewPanel = ({
  styles,
  currentMode,
}: ThemeEditorPreviewProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [activeTab, setActiveTab] = useQueryState('p', {
    defaultValue: 'cards',
  });

  if (!styles || !styles[currentMode]) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col',
          isFullscreen && 'bg-background fixed inset-0 z-50',
        )}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <HorizontalScrollArea className="mt-2 mb-1 flex w-full items-center justify-between px-4">
            <TabsList className="bg-background text-muted-foreground inline-flex w-fit items-center justify-center rounded-full px-0">
              <TabsTriggerPill value="cards">Cards</TabsTriggerPill>

              <div className="hidden md:flex">
                <TabsTriggerPill value="dashboard">Dashboard</TabsTriggerPill>
              </div>
              <TabsTriggerPill value="typography">Typography</TabsTriggerPill>
              <TabsTriggerPill value="colors">Color Palette</TabsTriggerPill>
            </TabsList>

            <div className="flex items-center gap-0.5">
              {isFullscreen && (
                <ThemeToggle
                  variant="ghost"
                  size="icon"
                  className="group size-8 hover:[&>svg]:scale-120 hover:[&>svg]:transition-all"
                />
              )}
              <TooltipWrapper
                label={isFullscreen ? 'Exit full screen' : 'Full screen'}
                className="hidden md:inline-flex"
                asChild
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="group size-8"
                >
                  {isFullscreen ? (
                    <Minimize className="transition-all group-hover:scale-120" />
                  ) : (
                    <Maximize className="transition-all group-hover:scale-120" />
                  )}
                </Button>
              </TooltipWrapper>
            </div>
          </HorizontalScrollArea>

          <section className="relative size-full overflow-hidden p-4 pt-1">
            <div className="relative isolate size-full overflow-hidden rounded-lg border">
              <TabsContent value="cards" className="m-0 size-full">
                <ExamplesPreviewContainer className="size-full">
                  <ScrollArea className="size-full">
                    <DemoCards />
                  </ScrollArea>
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent
                value="dashboard"
                className="@container m-0 size-full"
              >
                <ExamplesPreviewContainer className="size-full">
                  <ScrollArea className="size-full">
                    <div className="size-full min-w-350">
                      <DemoDashboard />
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="typography" className="m-0 size-full">
                <ExamplesPreviewContainer className="size-full">
                  <ScrollArea className="size-full">
                    <TypographyDemo />
                  </ScrollArea>
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="colors" className="m-0 size-full">
                <ScrollArea className="size-full">
                  <div className="p-4">
                    <ColorPreview styles={styles} currentMode={currentMode} />
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </section>
        </Tabs>
      </div>
    </>
  );
};

export default ThemePreviewPanel;
