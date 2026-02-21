import { json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import type { ThemeStyles } from '@/types/theme';

// ts-prune-ignore-next
export const theme = pgTable('theme', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  styles: json('styles').$type<ThemeStyles>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
});

// ts-prune-ignore-next
export type Theme = typeof theme.$inferSelect;
// ts-prune-ignore-next
export type NewTheme = typeof theme.$inferInsert;
