'use server';

import { db } from '@/db/client';
import { THEMES_PAGE_SIZE } from '@/lib/constants';
import {
  ThemeStyles,
  themeStylesSchema,
} from '@/third_party/tweakcn/types/theme';
import {
  ThemeNotFoundError,
  ValidationError,
  actionSuccess,
} from '@/types/errors';
import type { MyTheme, MyThemeResponse } from '@/types/my-theme';
import { desc, eq, sql } from 'drizzle-orm';
import { cache } from 'react';
import { z } from 'zod';
import { theme as themeTable } from '../db/schema/theme';

function logError(error: Error, context: Record<string, unknown>) {
  if (error.name === 'ValidationError') {
    console.warn('Expected error:', { error: error.message, context });
  } else {
    console.error('Unexpected error:', {
      error: error.message,
      stack: error.stack,
      context,
    });
  }
}

const createThemeSchema = z.object({
  name: z
    .string()
    .min(1, 'Theme name cannot be empty')
    .max(50, 'Theme name too long'),
  styles: themeStylesSchema,
});

const updateThemeSchema = z.object({
  id: z.string().min(1, 'Theme ID required'),
  name: z
    .string()
    .min(1, 'Theme name cannot be empty')
    .max(50, 'Theme name too long')
    .optional(),
  styles: themeStylesSchema.optional(),
});

const getThemesPaginatedSchema = z.object({
  cursor: z.union([z.string(), z.number()]).optional(),
  limit: z.number().min(1).max(50).default(THEMES_PAGE_SIZE),
});

export async function getThemes() {
  try {
    return await db.select().from(themeTable);
  } catch (error) {
    logError(error as Error, { action: 'getThemes' });
    throw error;
  }
}

export const getTheme = cache(async (themeId: string) => {
  try {
    if (!themeId) {
      throw new ValidationError('Theme ID required');
    }

    const [theme] = await db
      .select()
      .from(themeTable)
      .where(eq(themeTable.id, themeId))
      .limit(1);
    if (!theme) {
      throw new ThemeNotFoundError();
    }

    return theme;
  } catch (error) {
    logError(error as Error, { action: 'getTheme', themeId });
    throw error;
  }
});

export async function createTheme(formData: {
  name: string;
  styles: ThemeStyles;
}) {
  try {
    const validation = createThemeSchema.safeParse(formData);
    if (!validation.success) {
      throw new ValidationError('Invalid input', validation.error.format());
    }

    const { name, styles } = validation.data;
    const now = new Date();

    const [insertedTheme] = await db
      .insert(themeTable)
      .values({
        id: crypto.randomUUID(),
        name,
        styles,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return actionSuccess(insertedTheme);
  } catch (error) {
    logError(error as Error, {
      action: 'createTheme',
      formData: { name: formData.name },
    });
    throw error;
  }
}

export async function updateTheme(formData: {
  id: string;
  name?: string;
  styles?: ThemeStyles;
}) {
  try {
    const validation = updateThemeSchema.safeParse(formData);
    if (!validation.success) {
      throw new ValidationError('Invalid input', validation.error.format());
    }

    const { id: themeId, name, styles } = validation.data;
    if (!name && !styles) {
      throw new ValidationError('No update data provided');
    }

    const updateData: Partial<typeof themeTable.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (name) updateData.name = name;
    if (styles) updateData.styles = styles;

    const [updatedTheme] = await db
      .update(themeTable)
      .set(updateData)
      .where(eq(themeTable.id, themeId))
      .returning();

    if (!updatedTheme) {
      throw new ThemeNotFoundError('Theme not found');
    }

    return updatedTheme;
  } catch (error) {
    logError(error as Error, { action: 'updateTheme', themeId: formData.id });
    throw error;
  }
}

export async function deleteTheme(themeId: string) {
  try {
    if (!themeId) {
      throw new ValidationError('Theme ID required');
    }

    const [deletedTheme] = await db
      .delete(themeTable)
      .where(eq(themeTable.id, themeId))
      .returning({ id: themeTable.id, name: themeTable.name });

    if (!deletedTheme) {
      throw new ThemeNotFoundError('Theme not found');
    }

    return deletedTheme;
  } catch (error) {
    logError(error as Error, { action: 'deleteTheme', themeId });
    throw error;
  }
}

export async function getThemesPaginated(
  cursor?: string | number,
  limit: number = THEMES_PAGE_SIZE,
): Promise<MyThemeResponse> {
  try {
    const validation = getThemesPaginatedSchema.safeParse({ cursor, limit });
    if (!validation.success) {
      throw new ValidationError('Invalid input', validation.error.format());
    }

    const fetchLimit = limit + 1;
    let rows;

    if (cursor && typeof cursor === 'string') {
      rows = await db
        .select()
        .from(themeTable)
        .where(sql`${themeTable.createdAt} < ${cursor}`)
        .orderBy(desc(themeTable.createdAt))
        .limit(fetchLimit);
    } else {
      rows = await db
        .select()
        .from(themeTable)
        .orderBy(desc(themeTable.createdAt))
        .limit(fetchLimit);
    }

    const hasMore = rows.length > limit;
    const themes = rows.slice(0, limit);
    const nextCursor = hasMore
      ? themes[themes.length - 1].createdAt.toISOString()
      : null;

    const mappedThemes: MyTheme[] = themes.map((row) => ({
      id: row.id,
      themeId: row.id,
      name: row.name,
      styles: row.styles,
      publishedAt: row.createdAt.toISOString(),
    }));

    return { themes: mappedThemes, nextCursor };
  } catch (error) {
    logError(error as Error, { action: 'getThemesPaginated', cursor });
    throw error;
  }
}

export async function getThemePublishData(themeId: string): Promise<{
  themeId: string;
  publishedAt: string;
} | null> {
  try {
    if (!themeId) {
      throw new ValidationError('Theme ID required');
    }

    const [theme] = await db
      .select()
      .from(themeTable)
      .where(eq(themeTable.id, themeId))
      .limit(1);
    if (!theme) return null;

    return {
      themeId: theme.id,
      publishedAt: theme.createdAt.toISOString(),
    };
  } catch (error) {
    logError(error as Error, { action: 'getThemePublishData', themeId });
    return null;
  }
}
