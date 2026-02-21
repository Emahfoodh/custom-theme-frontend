import { useCallback, useState } from "react";
import { createTheme, updateTheme, deleteTheme } from "@/actions/themes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useThemePresetStore } from "@/third_party/tweakcn/store/theme-preset-store";
import { ThemeStyles } from "@/third_party/tweakcn/types/theme";

function handleMutationError(error: Error, operation: string) {
  console.error(`Theme ${operation} error:`, error);

  const getErrorMessage = (err: Error) => {
    switch (err.name) {
      case "ValidationError":
        return err.message || "Invalid input provided.";
      case "ThemeNotFoundError":
        return "Theme not found.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  toast.error(`Failed to ${operation} theme`, {
    description: getErrorMessage(error),
  });

  return error;
}

export function useCreateTheme() {
  const { registerPreset } = useThemePresetStore();
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(async (data: { name: string; styles: ThemeStyles }) => {
    setIsPending(true);

    try {
      const result = await createTheme(data);
      if (!result.success) {
        throw new Error(result.error.message);
      }

      registerPreset(result.data.id, {
        label: result.data.name,
        source: "SAVED",
        createdAt: result.data.createdAt.toISOString(),
        styles: result.data.styles,
      });

      toast.success("Theme created", {
        description: `"${result.data.name}" has been created successfully.`,
      });

      return result.data;
    } catch (error) {
      throw handleMutationError(error as Error, "create");
    } finally {
      setIsPending(false);
    }
  }, [registerPreset]);

  const mutate = useCallback(
    (data: { name: string; styles: ThemeStyles }) => {
      void mutateAsync(data);
    },
    [mutateAsync]
  );

  return {
    isPending,
    mutate,
    mutateAsync,
  };
}

export function useUpdateTheme() {
  const { updatePreset } = useThemePresetStore();
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(async (data: { id: string; name?: string; styles?: ThemeStyles }) => {
    setIsPending(true);

    try {
      const updated = await updateTheme(data);

      updatePreset(updated.id, {
        label: updated.name,
        source: "SAVED",
        createdAt: updated.createdAt.toISOString(),
        styles: updated.styles,
      });

      toast.success("Theme updated", {
        description: `"${updated.name}" has been updated successfully.`,
      });

      return updated;
    } catch (error) {
      throw handleMutationError(error as Error, "update");
    } finally {
      setIsPending(false);
    }
  }, [updatePreset]);

  const mutate = useCallback(
    (data: { id: string; name?: string; styles?: ThemeStyles }) => {
      void mutateAsync(data);
    },
    [mutateAsync]
  );

  return {
    isPending,
    mutate,
    mutateAsync,
  };
}

export function useDeleteTheme() {
  const { unregisterPreset } = useThemePresetStore();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(async (themeId: string) => {
    setIsPending(true);

    try {
      const deleted = await deleteTheme(themeId);
      unregisterPreset(themeId);

      toast.success("Theme deleted", {
        description: `"${deleted.name}" has been deleted successfully.`,
      });

      router.refresh();
      return deleted;
    } catch (error) {
      throw handleMutationError(error as Error, "delete");
    } finally {
      setIsPending(false);
    }
  }, [router, unregisterPreset]);

  const mutate = useCallback(
    (themeId: string) => {
      void mutateAsync(themeId);
    },
    [mutateAsync]
  );

  return {
    isPending,
    mutate,
    mutateAsync,
  };
}
