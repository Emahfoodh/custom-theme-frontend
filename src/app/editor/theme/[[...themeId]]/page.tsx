import { getTheme } from '@/actions/themes';
import Editor from '@/components/editor/editor';

export default async function EditorPage({
  params,
}: {
  params: Promise<{ themeId: string[] }>;
}) {
  const { themeId } = await params;
  const themePromise =
    themeId?.length > 0 ? getTheme(themeId?.[0]) : Promise.resolve(null);

  return <Editor themePromise={themePromise} />;
}
