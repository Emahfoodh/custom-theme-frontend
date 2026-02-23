/*
 * This file is part of tweakcn
 * Copyright (c) Sahaj J.
 * Licensed under the Apache License 2.0
 *
 * Modifications 2026:
 * - Code formatting adjustments
 * - Updated import paths to match project structure
 */
import { createContext } from 'react';

interface SectionContextType {
  /** Whether the parent ControlSection is currently expanded */
  isExpanded: boolean;
  /** Set the expanded state explicitly */
  setIsExpanded: (expanded: boolean) => void;
  /** Helper to toggle the expanded state */
  toggleExpanded: () => void;
}

/**
 * Context that allows descendants of a ControlSection to query or mutate
 * the expanded / collapsed state of their parent section.
 */
export const SectionContext = createContext<SectionContextType | undefined>(
  undefined,
);
