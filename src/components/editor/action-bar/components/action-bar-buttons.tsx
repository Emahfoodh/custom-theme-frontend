import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/store/editor-store';
import { CodeButton } from './code-button';
import { ImportButton } from './import-button';
import { MoreOptions } from './more-options';
import { ResetButton } from './reset-button';
import { SaveButton } from './save-button';
import { UndoRedoButtons } from './undo-redo-buttons';

interface ActionBarButtonsProps {
  onImportClick: () => void;
  onCodeClick: () => void;
  onSaveClick: () => void;
  isSaving: boolean;
}

export function ActionBarButtons({
  onImportClick,
  onCodeClick,
  onSaveClick,
  isSaving,
}: ActionBarButtonsProps) {
  const resetToCurrentPreset = useEditorStore((state) => state.resetToCurrentPreset);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges());
  const isBusy = isSaving;

  const handleReset = () => {
    resetToCurrentPreset();
  };

  return (
    <div className="flex items-center gap-1">
      <MoreOptions disabled={isBusy} />
      <Separator orientation="vertical" className="mx-1 h-8" />
      <ThemeToggle />
      <Separator orientation="vertical" className="mx-1 h-8" />
      <UndoRedoButtons disabled={isBusy} />
      <Separator orientation="vertical" className="mx-1 h-8" />
      <ResetButton
        onClick={handleReset}
        disabled={!hasUnsavedChanges || isBusy}
      />
      <div className="hidden items-center gap-1 md:flex">
        <ImportButton onClick={onImportClick} disabled={isBusy} />
        <CodeButton onClick={onCodeClick} disabled={isBusy} />
      </div>
      <Separator orientation="vertical" className="mx-1 h-8" />
      <SaveButton onClick={onSaveClick} isSaving={isSaving} disabled={isBusy} />
    </div>
  );
}
