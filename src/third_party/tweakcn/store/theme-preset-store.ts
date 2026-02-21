/*
 * This file is part of tweakcn
 * Copyright (c) Sahaj J.
 * Licensed under the Apache License 2.0
 *
 * Modifications 2026:
 * - Code formatting adjustments
 * - Updated import paths to match project structure
 */
import { getThemes } from '@/actions/themes';
import { ThemePreset } from '@/third_party/tweakcn/types/theme';
import { defaultPresets } from '@/third_party/tweakcn/utils/theme-presets';
import { create } from 'zustand';

interface ThemePresetStore {
  presets: Record<string, ThemePreset>;
  registerPreset: (name: string, preset: ThemePreset) => void;
  unregisterPreset: (name: string) => void;
  updatePreset: (name: string, preset: ThemePreset) => void;
  getPreset: (name: string) => ThemePreset | undefined;
  getAllPresets: () => Record<string, ThemePreset>;
  loadSavedPresets: () => Promise<void>;
  unloadSavedPresets: () => void;
}

export const useThemePresetStore = create<ThemePresetStore>()((set, get) => ({
  presets: defaultPresets,
  registerPreset: (name: string, preset: ThemePreset) => {
    set((state) => ({
      presets: {
        ...state.presets,
        [name]: preset,
      },
    }));
  },
  unregisterPreset: (name: string) => {
    set((state) => {
      const { [name]: _, ...remainingPresets } = state.presets;
      return {
        presets: remainingPresets,
      };
    });
  },
  loadSavedPresets: async () => {
    try {
      const savedThemes = await getThemes();
      const savedPresets = savedThemes.reduce(
        (acc, theme) => {
          acc[theme.id] = {
            label: theme.name,
            styles: theme.styles,
            source: 'SAVED',
          };
          return acc;
        },
        {} as Record<string, ThemePreset>,
      );

      set((state) => ({
        presets: {
          ...state.presets,
          ...savedPresets,
        },
      }));
    } catch (error) {
      console.error('Failed to load saved presets:', error);
    }
  },
  unloadSavedPresets: () => {
    set({ presets: defaultPresets });
  },
  updatePreset: (name: string, preset: ThemePreset) => {
    set((state) => ({
      presets: {
        ...state.presets,
        [name]: preset,
      },
    }));
  },
  getPreset: (name: string) => {
    return get().presets[name];
  },
  getAllPresets: () => {
    return get().presets;
  },
}));
