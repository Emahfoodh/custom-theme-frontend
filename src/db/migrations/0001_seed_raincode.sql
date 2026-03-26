CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE "theme"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

INSERT INTO "theme" ("name", "styles", "created_at", "updated_at")
SELECT
  'Raincode',
  $json${"dark":{"card":"#111827","ring":"#3b82f6","input":"#1e293b","muted":"#1e293b","accent":"#1e293b","border":"#1e293b","radius":"0.5rem","chart-1":"#60a5fa","chart-2":"#3b82f6","chart-3":"#94a3b8","chart-4":"#1e293b","chart-5":"#111827","popover":"#0a0f1a","primary":"#60a5fa","sidebar":"#111827","spacing":"0.23rem","font-mono":"JetBrains Mono, monospace","font-sans":"DM Sans, Geist, Inter, sans-serif","secondary":"#1e293b","background":"#0a0f1a","font-serif":"Georgia, serif","foreground":"#f8fafc","destructive":"#ef4444","shadow-blur":"20px","shadow-color":"hsl(0 0% 0%)","sidebar-ring":"#3b82f6","shadow-spread":"0px","letter-spacing":"0em","shadow-opacity":"0.4","sidebar-accent":"#1e293b","sidebar-border":"#1e293b","card-foreground":"#f8fafc","shadow-offset-x":"0px","shadow-offset-y":"1px","sidebar-primary":"#60a5fa","muted-foreground":"#94a3b8","accent-foreground":"#f8fafc","popover-foreground":"#f8fafc","primary-foreground":"#ffffff","sidebar-foreground":"#f8fafc","secondary-foreground":"#f8fafc","destructive-foreground":"#ffffff","sidebar-accent-foreground":"#f8fafc","sidebar-primary-foreground":"#ffffff"},"light":{"card":"#ffffff","ring":"#4075c1","input":"#ffffff","muted":"#e6e6e6","accent":"#5481ca","border":"#e1e1e1","radius":"0.35rem","chart-1":"#4075c1","chart-2":"#4c66a3","chart-3":"#6681bc","chart-4":"#aab9da","chart-5":"#ccd6e9","popover":"#ffffff","primary":"#4075c1","sidebar":"#f1f2f6","spacing":"0.23rem","font-mono":"JetBrains Mono, Courier New, monospace","font-sans":"\"DM Sans\", Inter, ui-sans-serif, sans-serif, system-ui","secondary":"#ccd6e9","background":"#f1f2f6","font-serif":"Geist, \"Noto Sans\", Georgia, serif","foreground":"#121212","destructive":"#c04747","shadow-blur":"2px","shadow-color":"#13261b","sidebar-ring":"#4075c1","shadow-spread":"0px","letter-spacing":"0em","shadow-opacity":"0.04","sidebar-accent":"#ccd6e9","sidebar-border":"#e1e1e1","card-foreground":"#121212","shadow-offset-x":"0px","shadow-offset-y":"1px","sidebar-primary":"#4075c1","muted-foreground":"#6b6b6b","accent-foreground":"#f1f2f6","popover-foreground":"#121212","primary-foreground":"#ffffff","sidebar-foreground":"#121212","secondary-foreground":"#121212","destructive-foreground":"#ffffff","sidebar-accent-foreground":"#121212","sidebar-primary-foreground":"#ffffff"}}$json$::json,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1
  FROM "theme"
  WHERE lower("name") = 'raincode'
);
