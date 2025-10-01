"use client";

import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const current = theme || resolvedTheme || "light";

  const icon = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    custom: <Palette className="h-4 w-4" />
  }[current as "light" | "dark" | "custom"] ?? <Sun className="h-4 w-4" />;

  async function nextTheme() {
    const next = current === "light" ? "dark" : current === "dark" ? "custom" : "light";
    setTheme(next);
    try {
      await axios.post("/api/theme", { theme: next });
    } catch (error) {
      console.error("Failed to persist theme", error);
    }
  }

  return (
    <Button variant="ghost" onClick={nextTheme} className="gap-2">
      {icon}
      <span className="text-sm capitalize">{current} theme</span>
    </Button>
  );
}
