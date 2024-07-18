"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { clientSessionToken } from "./untils/http";
import { CustomerResType, StaffResType } from "./schemaValidations/auth.schema";

type CustomerDataType = CustomerResType["data"];
type StaffDataType = StaffResType["data"];
type User = CustomerDataType | StaffDataType | null;
const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);

  return context;
};

export default function AppProvider({
  children,
  initialSessionToken = "",
  user: userProp, // Đổi tên thành userProp để tránh nhầm lẫn với biến username bên trong AppProvider
}: {
  children: ReactNode;
  initialSessionToken?: string;
  user: User | null; // Thay đổi thành userProp
}) {
  const [user, setUser] = useState<User | null>(userProp);

  useState(() => {
    if (typeof window !== "undefined") {
      clientSessionToken.value = initialSessionToken;
    }
  });

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
