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

export default function ProfileDropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {" "}
        {/* Adjusted width */}
        <DropdownMenuLabel className="text-sm">
          {" "}
          {/* Adjust font size */}
          Tài khoản của tôi
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm">
          {" "}
          {/* Adjust font size */}
          <Link href="/pages/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          {" "}
          {/* Adjust font size */}
          <Link href="/order-history">Lịch sử đơn hàng</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          {" "}
          {/* Adjust font size */}
          <Link href="/pages/apointment">Tạo lịch hẹn</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-sm">
          {" "}
          {/* Adjust font size */}
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DropdownMenuSeparator />
    </DropdownMenu>
  );
}
