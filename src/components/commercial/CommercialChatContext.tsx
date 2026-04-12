"use client";

import { createContext, useContext } from "react";

export const CommercialChatInjectContext = createContext<
  ((text: string) => void) | null
>(null);

export function useCommercialChatInject() {
  return useContext(CommercialChatInjectContext);
}
