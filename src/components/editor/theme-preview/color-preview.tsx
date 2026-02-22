import { CopyButton } from '@/components/copy-button';
import { TooltipWrapper } from '@/components/tooltip-wrapper';
import { Button } from '@/components/ui/button';
import {
  FocusColorId,
  useColorControlFocus,
} from '@/third_party/tweakcn/store/color-control-focus-store';
import { ThemeEditorPreviewProps } from '@/third_party/tweakcn/types/theme';
import { SquarePen } from 'lucide-react';

interface ColorPreviewProps {
  styles: ThemeEditorPreviewProps['styles'];
  currentMode: ThemeEditorPreviewProps['currentMode'];
}

function ColorPreviewItem({
  label,
  color,
  name,
}: {
  label: string;
  color: string;
  name: string;
}) {
  const { focusColor } = useColorControlFocus();

  return (
    <div className="group/color-preview overflow-hidden rounded-lg bg-card">
      <div
        className="h-14 w-full @max-3xl:h-12"
        style={{ backgroundColor: color }}
      />
      <div className="bg-card space-y-1.5 px-2.5 py-2">
        <div className="space-y-0.5">
          <p className="truncate text-xs font-medium sm:text-sm">{label}</p>
          <p className="text-muted-foreground truncate font-mono text-[11px]">
            {color}
          </p>
        </div>

        <div className="flex items-center justify-end gap-0.5">
          <TooltipWrapper label="Edit color" asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => focusColor(name as FocusColorId)}
              className="text-muted-foreground hover:text-foreground size-6 [&>svg]:size-3.5"
            >
              <SquarePen />
            </Button>
          </TooltipWrapper>
          <CopyButton
            textToCopy={color}
            className="text-muted-foreground hover:text-foreground size-6"
          />
        </div>
      </div>
    </div>
  );
}

const ColorPreview = ({ styles, currentMode }: ColorPreviewProps) => {
  if (!styles || !styles[currentMode]) {
    return null;
  }

  return (
    <div className="@container grid grid-cols-1 gap-4 md:gap-8">
      {/* Primary Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Primary Theme Colors
        </h3>
        <div className="@6xl grid grid-cols-2 gap-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5">
          <ColorPreviewItem
            label="Background"
            color={styles[currentMode].background}
            name="background"
          />
          <ColorPreviewItem
            label="Foreground"
            color={styles[currentMode].foreground}
            name="foreground"
          />
          <ColorPreviewItem
            label="Primary"
            color={styles[currentMode].primary}
            name="primary"
          />
          <ColorPreviewItem
            label="Primary Foreground"
            color={styles[currentMode]['primary-foreground']}
            name="primary-foreground"
          />
        </div>
      </div>

      {/* Secondary & Accent Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Secondary & Accent Colors
        </h3>
        <div className="@6xl grid grid-cols-2 gap-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5">
          <ColorPreviewItem
            label="Secondary"
            color={styles[currentMode].secondary}
            name="secondary"
          />
          <ColorPreviewItem
            label="Secondary Foreground"
            color={styles[currentMode]['secondary-foreground']}
            name="secondary-foreground"
          />
          <ColorPreviewItem
            label="Accent"
            color={styles[currentMode].accent}
            name="accent"
          />
          <ColorPreviewItem
            label="Accent Foreground"
            color={styles[currentMode]['accent-foreground']}
            name="accent-foreground"
          />
        </div>
      </div>

      {/* UI Component Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          UI Component Colors
        </h3>
        <div className="grid grid-cols-2 gap-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5">
          <ColorPreviewItem
            label="Card"
            color={styles[currentMode].card}
            name="card"
          />
          <ColorPreviewItem
            label="Card Foreground"
            color={styles[currentMode]['card-foreground']}
            name="card-foreground"
          />
          <ColorPreviewItem
            label="Popover"
            color={styles[currentMode].popover}
            name="popover"
          />
          <ColorPreviewItem
            label="Popover Foreground"
            color={styles[currentMode]['popover-foreground']}
            name="popover-foreground"
          />
          <ColorPreviewItem
            label="Muted"
            color={styles[currentMode].muted}
            name="muted"
          />
          <ColorPreviewItem
            label="Muted Foreground"
            color={styles[currentMode]['muted-foreground']}
            name="muted-foreground"
          />
        </div>
      </div>

      {/* Utility & Form Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Utility & Form Colors
        </h3>
        <div className="grid grid-cols-2 gap-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5">
          <ColorPreviewItem
            label="Border"
            color={styles[currentMode].border}
            name="border"
          />
          <ColorPreviewItem
            label="Input"
            color={styles[currentMode].input}
            name="input"
          />
          <ColorPreviewItem
            label="Ring"
            color={styles[currentMode].ring}
            name="ring"
          />
        </div>
      </div>

      {/* Status & Feedback Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Status & Feedback Colors
        </h3>
        <div className="grid grid-cols-2 gap-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5">
          <ColorPreviewItem
            label="Destructive"
            color={styles[currentMode].destructive}
            name="destructive"
          />
          <ColorPreviewItem
            label="Destructive Foreground"
            color={styles[currentMode]['destructive-foreground']}
            name="destructive-foreground"
          />
        </div>
      </div>

      {/* Chart & Data Visualization Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Chart & Visualization Colors
        </h3>
        <div className="grid grid-cols-2 gap-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5">
          <ColorPreviewItem
            label="Chart 1"
            color={styles[currentMode]['chart-1']}
            name="chart-1"
          />
          <ColorPreviewItem
            label="Chart 2"
            color={styles[currentMode]['chart-2']}
            name="chart-2"
          />
          <ColorPreviewItem
            label="Chart 3"
            color={styles[currentMode]['chart-3']}
            name="chart-3"
          />
          <ColorPreviewItem
            label="Chart 4"
            color={styles[currentMode]['chart-4']}
            name="chart-4"
          />
          <ColorPreviewItem
            label="Chart 5"
            color={styles[currentMode]['chart-5']}
            name="chart-5"
          />
        </div>
      </div>

      {/* Sidebar Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">
          Sidebar & Navigation Colors
        </h3>
        <div className="grid grid-cols-2 gap-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5">
          <ColorPreviewItem
            label="Sidebar Background"
            color={styles[currentMode].sidebar}
            name="sidebar"
          />
          <ColorPreviewItem
            label="Sidebar Foreground"
            color={styles[currentMode]['sidebar-foreground']}
            name="sidebar-foreground"
          />
          <ColorPreviewItem
            label="Sidebar Primary"
            color={styles[currentMode]['sidebar-primary']}
            name="sidebar-primary"
          />
          <ColorPreviewItem
            label="Sidebar Primary Foreground"
            color={styles[currentMode]['sidebar-primary-foreground']}
            name="sidebar-primary-foreground"
          />
          <ColorPreviewItem
            label="Sidebar Accent"
            color={styles[currentMode]['sidebar-accent']}
            name="sidebar-accent"
          />
          <ColorPreviewItem
            label="Sidebar Accent Foreground"
            color={styles[currentMode]['sidebar-accent-foreground']}
            name="sidebar-accent-foreground"
          />
          <ColorPreviewItem
            label="Sidebar Border"
            color={styles[currentMode]['sidebar-border']}
            name="sidebar-border"
          />
          <ColorPreviewItem
            label="Sidebar Ring"
            color={styles[currentMode]['sidebar-ring']}
            name="sidebar-ring"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPreview;
