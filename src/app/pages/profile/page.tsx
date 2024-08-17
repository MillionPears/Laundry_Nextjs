import type { Metadata } from "next";
import profileApiRequest from "@/app/apiRequest/profile";
import ProfileForm from "./ProfileForm";
import { useAppContext } from "@/app/app-provider";
import authApiRequest from "@/app/apiRequest/auth";
import { cookies } from "next/headers";
import {
  CustomerResType,
  StaffResType,
} from "@/app/schemaValidations/auth.schema";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Hồ sơ người dùng",
};

export default async function MeProfile() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  type CustomerDataType = CustomerResType["data"];
  type StaffDataType = StaffResType["data"];
  let user: CustomerDataType | StaffDataType | null = null;
  // if (sessionToken) {
  //   const data = await profileApiRequest.profile(sessionToken);
  // }
  const username = cookieStore.get("username");

  if (username && sessionToken) {
    try {
      const roleData = await authApiRequest.roleid(
        username.value,
        sessionToken.value
      );

      if (roleData) {
        if (roleData.payload.data === 1) {
          const result = await profileApiRequest.customerProfile(
            username.value,
            sessionToken.value
          );

          user = result.payload.data;
        } else {
          const result = await profileApiRequest.staffProfile(
            username.value,
            sessionToken.value
          );
          user = result.payload.data;
        }
      }
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
  }
  return (
    <div>
      <ProfileForm user={user} />
    </div>
  );
}
