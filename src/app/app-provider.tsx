"use client";
import { ReactNode, useState } from "react";
import { clientSessionToken } from "./untils/http";

export default function AppProvider({
  children,
  initialSessionToken = "",
}: {
  children: ReactNode;
  initialSessionToken?: string;
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      clientSessionToken.value = initialSessionToken;
    }
  });

  return <>{children}</>;
}
