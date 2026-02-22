export default function TypographyDemo() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <section className="space-y-2 rounded-lg border p-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Typography
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Type Specimen</h1>
        <p className="text-sm text-muted-foreground">
          Simple preview of heading scale, body copy, and UI text styles.
        </p>
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <p className="text-sm font-medium text-muted-foreground">Headings</p>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Heading 1</h1>
          <h2 className="text-3xl font-semibold tracking-tight">Heading 2</h2>
          <h3 className="text-2xl font-semibold tracking-tight">Heading 3</h3>
          <h4 className="text-xl font-semibold">Heading 4</h4>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <p className="text-sm font-medium text-muted-foreground">Body</p>
        <div className="space-y-3">
          <p className="text-base leading-7">
            This is the default body style used for longer content blocks and
            descriptions. It should remain highly readable across themes.
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            This is secondary body text used for helper copy and supporting
            information.
          </p>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <p className="text-sm font-medium text-muted-foreground">UI Text</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md bg-muted/40 p-3">
            <p className="text-sm font-medium">Button Label</p>
            <p className="text-xs text-muted-foreground">Primary action</p>
          </div>
          <div className="rounded-md bg-muted/40 p-3">
            <p className="text-sm font-medium">Input Label</p>
            <p className="text-xs text-muted-foreground">Helper message</p>
          </div>
          <div className="rounded-md bg-muted/40 p-3">
            <p className="text-sm font-medium">Table Header</p>
            <p className="text-xs text-muted-foreground">Column title</p>
          </div>
          <div className="rounded-md bg-muted/40 p-3">
            <p className="text-sm font-medium">Status Caption</p>
            <p className="text-xs text-muted-foreground">
              Updated 2 minutes ago
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
