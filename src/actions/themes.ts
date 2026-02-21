'use server';

import { db } from '@/db/client';
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

export async function getThemes() {
  try {
    return await db.select().from(themeTable);
  } catch (error) {
    logError(error as Error, { action: 'getThemes' });
    throw error;
  }
}
