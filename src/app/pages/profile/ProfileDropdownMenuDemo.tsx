"use client";

import authApiRequest from "@/app/apiRequest/auth";
import { useAppContext } from "@/app/app-provider";
import {
  CustomerResType,
  StaffResType,
} from "@/app/schemaValidations/auth.schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function DropdownMenuDemo() {
  const router = useRouter();
  const { user, setUser } = useAppContext();

  const handleViewOrders = () => {
    // Điều hướng đến trang lịch sử đơn hàng
    router.push("/pages/order");

    // Sau khi điều hướng hoàn tất, gọi router.refresh để làm mới dữ liệu
    router.refresh();
  };
  const handleLogout = useCallback(async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
      router.push("/pages/login");
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/pages/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewOrders}>
          Lịch sử đơn hàng
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/create-appointment">Tạo lịch hẹn</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button size={"sm"} onClick={handleLogout}>
            {" "}
            Đăng Xuất
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DropdownMenuSeparator />
    </DropdownMenu>
  );
}
