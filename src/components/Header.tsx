import Link from "next/link";
import Image from "next/image";
import logo from "/public/image/logo.png";
import { cookies } from "next/headers";
import ProfileDropdownMenuDemo from "@/app/pages/profile/ProfileDropdownMenuDemo";
import {
  CustomerResType,
  StaffResType,
} from "@/app/schemaValidations/auth.schema";

export default function Header({
  user,
}: {
  user: CustomerResType["data"] | StaffResType["data"] | null;
}) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 shadow-md sticky top-0 left-0 right-0 z-10">
      <div className="flex items-center">
        {/* Logo tiệm giặt */}
        <Image src={logo} alt="Logo" width={45} height={45} />
      </div>
      <nav className="ml-auto">
        <ul className="flex space-x-6 items-center">
          <li>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
            >
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link
              href="/pages/test"
              className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
            >
              Thông Tin Về Chúng Tôi
            </Link>
          </li>
          {sessionToken ? (
            <>
              <li>
                <ProfileDropdownMenuDemo />
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/pages/login"
                className="text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white font-semibold transition duration-300 px-4 py-2 rounded-full"
              >
                Đăng Nhập
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
