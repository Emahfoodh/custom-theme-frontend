import { getTheme, getThemePublishData } from '@/actions/themes';
import ThemeView from '@/components/theme-view';

interface ThemePageProps {
  params: Promise<{
    themeId: string;
  }>;
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { themeId } = await params;
  const [theme, themePublishData] = await Promise.all([
    getTheme(themeId),
    getThemePublishData(themeId),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="container mx-auto px-4 py-8">
        <ThemeView theme={theme} themePublishData={themePublishData} />
      </div>
    </div>
  );
}
