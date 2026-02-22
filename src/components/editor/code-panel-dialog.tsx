'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ThemeEditorState } from '@/third_party/tweakcn/types/editor';
import CodePanel from './code-panel';

interface CodePanelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themeEditorState: ThemeEditorState;
}

export function CodePanelDialog({
  open,
  onOpenChange,
  themeEditorState,
}: CodePanelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90dvh] max-h-[90dvh] overflow-hidden p-0 shadow-lg sm:h-[80dvh] sm:max-h-[min(700px,90dvh)] sm:w-[calc(100%-2rem)] sm:max-w-4xl">
        <div className="h-full space-y-6 overflow-auto px-6 pb-6 sm:py-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Theme Code</DialogTitle>
            <DialogDescription>
              View and copy the code for your theme.
            </DialogDescription>
          </DialogHeader>
          <CodePanel themeEditorState={themeEditorState} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
