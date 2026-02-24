import { CodePanelDialog } from '@/components/editor/code-panel-dialog';
import { ThemeSaveDialog } from '@/components/editor/theme-save-dialog';
import { useCreateTheme, useUpdateTheme } from '@/hooks/themes';
import CssImportDialog from '@/third_party/tweakcn/components/editor/css-import-dialog';
import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'sonner';
import { useEditorStore } from '../store/editor-store';
import { useThemePresetStore } from '../third_party/tweakcn/store/theme-preset-store';
import { parseCssInput } from '../third_party/tweakcn/utils/parse-css-input';

interface DialogActionsContextType {
  // Dialog states
  cssImportOpen: boolean;
  codePanelOpen: boolean;
  saveDialogOpen: boolean;
  isCreatingTheme: boolean;
  isUpdatingTheme: boolean;
  existingThemeName: string | undefined;

  // Dialog actions
  setCssImportOpen: (open: boolean) => void;
  setCodePanelOpen: (open: boolean) => void;
  setSaveDialogOpen: (open: boolean) => void;

  // Handler functions
  handleCssImport: (css: string) => void;
  handleSaveClick: () => void;
  saveTheme: (themeName: string) => Promise<void>;
  handleUpdateExisting: () => Promise<void>;
}

function useDialogActionsStore(): DialogActionsContextType {
  const [cssImportOpen, setCssImportOpen] = useState(false);
  const [codePanelOpen, setCodePanelOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const { themeState, setThemeState, applyThemePreset, hasUnsavedChanges } =
    useEditorStore();
  const { getPreset } = useThemePresetStore();
  const createThemeMutation = useCreateTheme();
  const updateThemeMutation = useUpdateTheme();

  const currentPreset = themeState?.preset
    ? getPreset(themeState.preset)
    : undefined;
  const isOnSavedPreset =
    !!currentPreset && currentPreset.source === 'SAVED' && hasUnsavedChanges();
  const existingThemeName = isOnSavedPreset ? currentPreset.label : undefined;

  const handleCssImport = (css: string) => {
    const { lightColors, darkColors } = parseCssInput(css);
    const styles = {
      ...themeState.styles,
      light: { ...themeState.styles.light, ...lightColors },
      dark: { ...themeState.styles.dark, ...darkColors },
    };

    setThemeState({
      ...themeState,
      styles,
    });

    toast.success('CSS imported successfully');
  };

  const handleSaveClick = () => {
    setSaveDialogOpen(true);
  };

  const saveTheme = async (themeName: string) => {
    const themeData = {
      name: themeName,
      styles: themeState.styles,
    };

    try {
      const theme = await createThemeMutation.mutateAsync(themeData);
      if (!theme) return;
      applyThemePreset(theme?.id || themeState.preset || 'default');
      setTimeout(() => {
        setSaveDialogOpen(false);
      }, 50);
    } catch (error) {
      console.error(
        'Save operation failed (error likely handled by hook):',
        error,
      );
    }
  };

  const handleUpdateExisting = async () => {
    if (!themeState.preset) return;
    try {
      const result = await updateThemeMutation.mutateAsync({
        id: themeState.preset,
        styles: themeState.styles,
      });
      if (result) {
        applyThemePreset(result.id || themeState.preset);
        setSaveDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const value = {
    // Dialog states
    cssImportOpen,
    codePanelOpen,
    saveDialogOpen,
    isCreatingTheme: createThemeMutation.isPending,
    isUpdatingTheme: updateThemeMutation.isPending,
    existingThemeName,

    // Dialog actions
    setCssImportOpen,
    setCodePanelOpen,
    setSaveDialogOpen,

    // Handler functions
    handleCssImport,
    handleSaveClick,
    saveTheme,
    handleUpdateExisting,
  };

  return value;
}

const DialogActionsContext =
  createContext<DialogActionsContextType | null>(null);

export function DialogActionsProvider({ children }: { children: ReactNode }) {
  const { themeState } = useEditorStore();
  const store = useDialogActionsStore();

  return (
    <DialogActionsContext value={store}>
      {children}

      {/* Global Dialogs */}
      <CssImportDialog
        open={store.cssImportOpen}
        onOpenChange={store.setCssImportOpen}
        onImport={store.handleCssImport}
      />
      <CodePanelDialog
        open={store.codePanelOpen}
        onOpenChange={store.setCodePanelOpen}
        themeEditorState={themeState}
      />
      <ThemeSaveDialog
        open={store.saveDialogOpen}
        onOpenChange={store.setSaveDialogOpen}
        onSave={store.saveTheme}
        isSaving={store.isCreatingTheme}
        existingThemeName={store.existingThemeName}
        onUpdateExisting={store.handleUpdateExisting}
        isUpdating={store.isUpdatingTheme}
      />
    </DialogActionsContext>
  );
}

export function useDialogActions(): DialogActionsContextType {
  const context = useContext(DialogActionsContext);

  if (!context) {
    throw new Error(
      'useDialogActions must be used within a DialogActionsProvider',
    );
  }

  return context;
}
