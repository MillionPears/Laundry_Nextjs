"use client";

import authApiRequest from "@/app/apiRequest/auth";
import { useAppContext } from "@/app/app-provider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const getImagePath = (imageName: string) => {
  return `/image/${imageName}.png`;
};

export default function Sidebar() {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);
  const { user, setUser } = useAppContext();
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Cập nhật currentPath mỗi khi pathname thay đổi
    setCurrentPath(pathname);
  }, [pathname]);

  useEffect(() => {
    const fetchRoleData = async () => {
      if (user?.username) {
        try {
          const roleData = await authApiRequest.roleIdClient(user.username);

          if (roleData && roleData.payload.data === 2) {
            setIsStaff(true);
            setIsAdmin(false);
          } else if (roleData && roleData.payload.data === 3) {
            setIsAdmin(true);
            setIsStaff(false);
          } else {
            setIsStaff(false);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    };

    fetchRoleData();
  }, [user?.username]);

  const staffMenuItems = [
    { href: "/admin", text: "Trang chủ" },
    { href: "/admin/order", text: "Quản lý đơn hàng" },
    { href: "/admin/order/delivery", text: "Quản lý giao hàng" },
    { href: "/admin/invoice", text: "Quản lý hóa đơn" },
    { href: "/admin/warehouse", text: "Quản lý kho" },
  ];

  const adminMenuItems = [
    ...staffMenuItems,
    { href: "/admin/promotion", text: "Quản lý khuyến mãi" },
    { href: "/admin/service", text: "Quản lý dịch vụ" },
    { href: "/admin/staff", text: "Quản lý nhân viên" },
  ];

  const menuItems = isStaff ? staffMenuItems : adminMenuItems;

  return (
    <div className="w-60 h-full bg-gradient-to-b from-blue-100 to-blue-300 text-gray-800 flex flex-col shadow-lg">
      <div className="flex justify-center my-6">
        <Link href="/admin">
          <Image
            src={getImagePath("logo")}
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full shadow-md cursor-pointer"
          />
        </Link>
      </div>
      <ul className="w-full list-none flex flex-col flex-grow space-y-2 p-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`p-4 border-b border-blue-200 last:border-none rounded-md transition-all duration-300 ease-in-out cursor-pointer
              ${
                currentPath === item.href
                  ? "bg-blue-500 text-white shadow-lg"
                  : "hover:bg-blue-200"
              }
            `}
          >
            <Link
              href={item.href}
              className={`block text-sm font-medium ${
                currentPath === item.href ? "text-white" : "text-gray-800"
              }`}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
