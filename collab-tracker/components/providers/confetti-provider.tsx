"use client";

import dynamic from "next/dynamic";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

type ConfettiContextValue = {
  burst: () => void;
};

const ConfettiContext = createContext<ConfettiContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function ConfettiProvider({ children }: Props) {
  const [visible, setVisible] = useState(false);

  const value = useMemo<ConfettiContextValue>(
    () => ({
      burst: () => {
        setVisible(true);
        setTimeout(() => setVisible(false), 2500);
      }
    }),
    []
  );

  return (
    <ConfettiContext.Provider value={value}>
      {visible && <ReactConfetti recycle={false} gravity={0.3} numberOfPieces={400} />}
      {children}
    </ConfettiContext.Provider>
  );
}

export function useConfetti() {
  const ctx = useContext(ConfettiContext);
  if (!ctx) {
    throw new Error("useConfetti must be used inside ConfettiProvider");
  }
  return ctx;
}
