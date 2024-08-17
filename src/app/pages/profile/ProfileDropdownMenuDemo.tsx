"use client";

import authApiRequest from "@/app/apiRequest/auth";
import { useAppContext } from "@/app/app-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function DropdownMenuDemo() {
  const router = useRouter();
  const { user, setUser } = useAppContext();
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const handleViewOrders = () => {
    router.push("/pages/order");
    router.refresh();
  };
  const handleViewSchedule = () => {
    router.push("/admin/schedule");
    router.refresh();
  };
  const handleViewProfile = () => {
    router.push("/pages/profile");
    router.refresh();
  };

  const handleLogout = useCallback(async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
      router.push("/login");
      setUser(null);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setUser(null);
      // localStorage.removeItem("sessionToken");
      router.refresh();
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
        <DropdownMenuItem onClick={handleViewProfile}>
          {/* <Link href="/pages/profile">Profile</Link> */}
          Profile
        </DropdownMenuItem>
        {/* Mục thêm cho nhân viên */}
        {isStaff && (
          <DropdownMenuItem onClick={handleViewSchedule}>
            Lịch làm việc
          </DropdownMenuItem>
        )}
        {/* Mục thêm cho khách hàng */}
        {!isAdmin && !isStaff && (
          <DropdownMenuItem onClick={handleViewOrders}>
            Lịch sử đơn hàng
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Button size={"sm"} onClick={handleLogout}>
            Đăng Xuất
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DropdownMenuSeparator />
    </DropdownMenu>
  );
}
