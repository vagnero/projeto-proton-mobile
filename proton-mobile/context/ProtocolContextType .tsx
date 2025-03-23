// src/context/ProtocolContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

type ProtocolContextType = {
  protocoloId: number | null;
  setProtocoloId: (id: number) => void;
};

const ProtocolContext = createContext<ProtocolContextType | undefined>(undefined);

export const ProtocolProvider = ({ children }: { children: ReactNode }) => {
  const [protocoloId, setProtocoloId] = useState<number | null>(null);

  return (
    <ProtocolContext.Provider value={{ protocoloId, setProtocoloId }}>
      {children}
    </ProtocolContext.Provider>
  );
};

export const useProtocol = () => {
  const context = useContext(ProtocolContext);
  if (!context) {
    throw new Error("useProtocol must be used within a ProtocolProvider");
  }
  return context;
};
