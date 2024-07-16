"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import React from "react";

export interface DropdownItem {
  label: string;
  shortcut?: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  items: DropdownItem[];
}

export function CustomDropdownMenu({ items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DropdownMenu>
      <div onClick={toggleDropdown}>
        {/* Replace with your Avatar or Button trigger */}
        <button className="bg-gray-200 p-2 rounded">Open Dropdown</button>
      </div>
      {isOpen && (
        <DropdownMenuContent className="w-56">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <DropdownMenuItem onClick={item.onClick}>
                {item.label}
                {item.shortcut && (
                  <span className="ml-2 text-gray-500">{item.shortcut}</span>
                )}
              </DropdownMenuItem>
              {index < items.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

// Usage example:
export default function App() {
  const handleProfile = () => {
    console.log("Profile clicked");
  };

  const handleHistory = () => {
    console.log("History clicked");
  };

  const handleAppointment = () => {
    console.log("Appointment clicked");
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const menuItems: DropdownItem[] = [
    { label: "Profile", onClick: handleProfile },
    { label: "Lịch sử đơn hàng", onClick: handleHistory },
    { label: "Tạo lịch hẹn", onClick: handleAppointment },
    { label: "Đăng xuất", onClick: handleLogout },
  ];

  return (
    <div className="flex justify-center items-center h-screen">
      <CustomDropdownMenu items={menuItems} />
    </div>
  );
}
