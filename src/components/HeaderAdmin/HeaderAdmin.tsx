"use client";
import authApiRequest from "@/app/apiRequest/auth";
import { useAppContext } from "@/app/app-provider";
import ProfileDropdownMenuDemo from "@/app/pages/profile/ProfileDropdownMenuDemo";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function HeaderAdmin() {
  const router = useRouter();
  const { user, setUser } = useAppContext();

  const handleLogout = useCallback(async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
      router.push("/login");
      setUser(null);
    } catch (error) {
      console.error("An error occurred:", error);
      // Nếu muốn xử lý lỗi cụ thể hơn, có thể kiểm tra lỗi và in ra các thông tin chi tiết
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Stack trace:", error.stack);
      } else {
        console.error("Unknown error:", error);
      }
    }
  }, [setUser]);

  return (
    <div className="bg-blue-50 text-gray-800 flex items-center justify-between px-6 py-4 shadow-md border-b border-blue-200">
      {/* Div chứa dòng chữ chào mừng và dropdown */}
      <div className="flex items-center ml-auto space-x-4">
        {/* Hiển thị thông điệp chào mừng */}
        <span className="text-lg">
          Xin chào, <span className="font-semibold">{user?.name}</span>
        </span>
        {/* Dropdown menu */}
        <ProfileDropdownMenuDemo />
      </div>
    </div>
  );
}
