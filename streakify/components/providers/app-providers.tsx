"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ToastProvider } from "@/components/ui/toast";
import { InfoButton } from "@/components/ui/info-popup";

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <AuthSessionProvider>
      <ThemeProvider>
        <ToastProvider>
          <ConfettiProvider>
            {children}
            <InfoButton />
          </ConfettiProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthSessionProvider>
  );
}
