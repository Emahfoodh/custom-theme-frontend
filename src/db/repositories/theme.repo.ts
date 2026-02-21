import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db/client';
import { theme } from '@/db/schema/theme';
import { themeStylesSchema } from '@/types/theme';

// ts-prune-ignore-next
export const createThemeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  styles: themeStylesSchema,
});

// ts-prune-ignore-next
export const updateThemeSchema = z
  .object({
    name: z.string().min(1).optional(),
    styles: themeStylesSchema.optional(),
  })
  .refine((value) => value.name !== undefined || value.styles !== undefined, {
    message: 'At least one field must be provided for update',
  });

// ts-prune-ignore-next
export type CreateThemeInput = z.infer<typeof createThemeSchema>;
// ts-prune-ignore-next
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;

// ts-prune-ignore-next
export async function createTheme(input: CreateThemeInput) {
  const payload = createThemeSchema.parse(input);
  const [created] = await db
    .insert(theme)
    .values({
      id: payload.id,
      name: payload.name,
      styles: payload.styles,
    })
    .returning();

  return created;
}

// ts-prune-ignore-next
export async function getThemeById(id: string) {
  const [record] = await db
    .select()
    .from(theme)
    .where(eq(theme.id, id))
    .limit(1);
  return record ?? null;
}

// ts-prune-ignore-next
export async function listThemes() {
  return db
    .select()
    .from(theme)
    .orderBy(desc(theme.updatedAt), desc(theme.createdAt));
}

// ts-prune-ignore-next
export async function updateTheme(id: string, input: UpdateThemeInput) {
  const payload = updateThemeSchema.parse(input);
  const [updated] = await db
    .update(theme)
    .set({
      ...payload,
      updatedAt: new Date(),
    })
    .where(eq(theme.id, id))
    .returning();

  return updated ?? null;
}

// ts-prune-ignore-next
export async function deleteTheme(id: string) {
  const [deleted] = await db.delete(theme).where(eq(theme.id, id)).returning();
  return deleted ?? null;
}
