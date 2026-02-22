export default function ThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <main className="flex min-h-screen flex-1 flex-col">{children}</main>
    </div>
  );
}
