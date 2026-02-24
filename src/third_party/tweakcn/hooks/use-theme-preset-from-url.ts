/*
 * This file is part of tweakcn
 * Copyright (c) Sahaj J.
 * Licensed under the Apache License 2.0
 *
 * Modifications 2026:
 * - Code formatting adjustments
 * - Updated import paths to match project structure
 */
import { useQueryState } from 'nuqs';
import React from 'react';
import { useEditorStore } from '../../../store/editor-store';

export const useThemePresetFromUrl = () => {
  const [preset, setPreset] = useQueryState('theme');
  const applyThemePreset = useEditorStore((state) => state.applyThemePreset);

  // Apply theme preset if it exists in URL and remove it
  React.useEffect(() => {
    if (preset) {
      applyThemePreset(preset);
      setPreset(null); // Remove the preset from URL
    }
  }, [preset, setPreset, applyThemePreset]);
};
