"use client";

import { useAppContext } from "@/app/app-provider";
import HeaderAdmin from "./HeaderAdmin/HeaderAdmin";
import Sidebar from "./Sidebar";
import {
  CustomerResType,
  StaffResType,
} from "@/app/schemaValidations/auth.schema";
import { useEffect } from "react";

export default function DefaultLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: CustomerResType["data"] | StaffResType["data"] | null;
}) {
  const { setUser } = useAppContext();
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <HeaderAdmin />
        <main className="flex-1 ">{children}</main>
      </div>
    </div>
  );
}
