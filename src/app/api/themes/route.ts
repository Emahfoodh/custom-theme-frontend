import { NextResponse } from 'next/server';

import { listThemes } from '@/db/repositories/theme.repo';

export async function GET() {
  try {
    const themes = await listThemes();
    return NextResponse.json(themes);
  } catch (error) {
    console.error('Failed to list themes', error);
    return NextResponse.json(
      { error: 'Failed to list themes' },
      { status: 500 },
    );
  }
}
