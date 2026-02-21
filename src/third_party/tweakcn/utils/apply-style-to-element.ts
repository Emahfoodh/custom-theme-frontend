/*
 * This file is part of tweakcn
 * Copyright (c) Sahaj J.
 * Licensed under the Apache License 2.0
 *
 * Modifications 2026:
 * - Code formatting adjustments
 */
export function applyStyleToElement(
  element: HTMLElement,
  key: string,
  value: string,
) {
  const currentStyle = element.getAttribute('style') || '';
  // Remove the existing variable definitions with the same name
  const cleanedStyle = currentStyle
    .replace(new RegExp(`--${key}:\\s*[^;]+;?`, 'g'), '')
    .trim();

  element.setAttribute('style', `${cleanedStyle}--${key}: ${value};`);
}
