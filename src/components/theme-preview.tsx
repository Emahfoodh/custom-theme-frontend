"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { extractFontFamily } from "@/third_party/tweakcn/utils/fonts";
import { loadGoogleFont } from "@/third_party/tweakcn/utils/fonts/google-fonts";
import { ThemeStyleProps } from "@/third_party/tweakcn/types/theme";
import { colorFormatter } from "@/third_party/tweakcn/utils/color-converter";

interface ThemePreviewProps {
  styles: ThemeStyleProps;
  name?: string;
  className?: string;
}

function computeBoxShadow(styles: ThemeStyleProps): string | undefined {
  const shadowColor = styles["shadow-color"];
  const shadowOpacity = parseFloat(styles["shadow-opacity"] || "0.1");
  const shadowBlur = styles["shadow-blur"] || "3px";
  const shadowSpread = styles["shadow-spread"] || "0px";
  const offsetX = styles["shadow-offset-x"] || "0";
  const offsetY = styles["shadow-offset-y"] || "1px";

  try {
    const hsl = colorFormatter(shadowColor, "hsl");
    const color = `${hsl.slice(0, -1)} / ${shadowOpacity.toFixed(2)})`;
    return `${offsetX} ${offsetY} ${shadowBlur} ${shadowSpread} ${color}`;
  } catch {
    return undefined;
  }
}

export function ThemePreview({ styles, name, className }: ThemePreviewProps) {
  const fontSans = styles["font-sans"];
  const fontFamily = fontSans ? extractFontFamily(fontSans) : null;

  const [fontLoaded, setFontLoaded] = useState(() => {
    if (!fontFamily) return true;
    if (typeof document !== "undefined" && document.fonts) {
      return document.fonts.check(`700 16px "${fontFamily}"`);
    }
    return false;
  });

  useEffect(() => {
    if (!fontFamily) {
      setFontLoaded(true);
      return;
    }

    if (
      typeof document !== "undefined" &&
      document.fonts?.check(`700 46px "${fontFamily}"`)
    ) {
      setFontLoaded(true);
      return;
    }

    loadGoogleFont(fontFamily, ["400", "700"]);

    document.fonts
      .load(`700 16px "${fontFamily}"`)
      .then(() => setFontLoaded(true))
      .catch(() => setFontLoaded(true));
  }, [fontFamily]);

  const c = {
    bg: styles.background || "#ffffff",
    primary: styles.primary || "#000000",
    secondary: styles.secondary || "#f1f5f9",
    accent: styles.accent || "#f1f5f9",
    muted: styles.muted || "#f1f5f9",
    fg: styles.foreground || "#000000",
    primaryFg: styles["primary-foreground"] || "#ffffff",
    secondaryFg: styles["secondary-foreground"] || "#000000",
    accentFg: styles["accent-foreground"] || "#000000",
    mutedFg: styles["muted-foreground"] || "#666666",
    destructive: styles.destructive || "#ef4444",
    destructiveFg: styles["destructive-foreground"] || "#ffffff",
    card: styles.card || "#ffffff",
    cardFg: styles["card-foreground"] || "#000000",
    border: styles.border || "#e2e8f0",
    ring: styles.ring || "#000000",
    radius: styles.radius || "0.5",
  };

  const boxShadow = computeBoxShadow(styles);
  const borderRadius = `${parseFloat(c.radius) * 0.75}rem`;

  return (
    <div
      className={cn(
        "relative w-full h-full select-none overflow-hidden",
        className
      )}
      style={{
        backgroundColor: c.bg,
        color: c.fg,
      }}
    >
      {/* Mini UI mockup */}
      <div className="absolute inset-3 flex flex-col gap-2">
        {/* Top bar with nav dots and "button" */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-2">
            <div
              className="truncate font-bold leading-tight"
              style={{
                fontSize: "1.1rem",
                color: c.fg,
                fontFamily: fontLoaded ? fontSans || undefined : undefined,
                opacity: fontFamily && !fontLoaded ? 0 : 1,
                transition: "opacity 0.15s ease-in",
              }}
            >
              {name || "Aa"}
            </div>
          </div>
          <div
            className="h-4 px-3 flex items-center"
            style={{
              backgroundColor: c.primary,
              borderRadius,
            }}
          >
            <span
              className="text-[6px] font-semibold leading-none"
              style={{
                color: c.primaryFg,
                fontFamily: fontLoaded ? fontSans || undefined : undefined,
              }}
            >
              {"Button"}
            </span>
          </div>
        </div>

        {/* Subtitle / muted text */}
        <div
          className="flex items-center gap-1.5"
          style={{
            fontSize: "7px",
            color: c.mutedFg,
            fontFamily: fontLoaded ? fontSans || undefined : undefined,
            opacity: fontFamily && !fontLoaded ? 0 : 1,
          }}
        >
          <div
            className="h-1 flex-1"
            style={{
              backgroundColor: c.muted,
              borderRadius,
            }}
          />
          <div
            className="h-1 w-1/3"
            style={{
              backgroundColor: c.muted,
              borderRadius,
            }}
          />
        </div>

        {/* Card mockup row */}
        <div className="mt-auto flex gap-1.5">
          <div
            className="flex-1 p-1.5"
            style={{
              backgroundColor: c.card,
              border: `1px solid ${c.border}`,
              borderRadius,
              boxShadow,
            }}
          >
            <div
              className="h-1.5 w-3/4 mb-1"
              style={{ backgroundColor: c.primary, borderRadius }}
            />
            <div
              className="h-1 w-full"
              style={{ backgroundColor: c.muted, borderRadius }}
            />
          </div>
          <div
            className="flex-1 p-1.5"
            style={{
              backgroundColor: c.card,
              border: `1px solid ${c.border}`,
              borderRadius,
              boxShadow,
            }}
          >
            <div
              className="h-1.5 w-2/3 mb-1"
              style={{ backgroundColor: c.accent, borderRadius }}
            />
            <div
              className="h-1 w-full"
              style={{ backgroundColor: c.muted, borderRadius }}
            />
          </div>
        </div>

        {/* Color swatches at bottom */}
        <div className="flex items-center gap-1 pt-1">
          {[c.primary, c.secondary, c.accent, c.muted, c.border, c.card].map(
            (color, i) => (
              <div
                key={i}
                className="h-2.5 w-2.5 rounded-full ring-1"
                style={{
                  backgroundColor: color,
                  // Use a transparent ring to give definition when swatch matches bg
                  boxShadow:
                    color === c.bg
                      ? `inset 0 0 0 1px ${c.border}`
                      : undefined,
                  ["--tw-ring-color" as string]: `${c.border}`,
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
