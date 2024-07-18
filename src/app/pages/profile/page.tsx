import type { Metadata } from "next";
import profileApiRequest from "@/app/apiRequest/profile";
import ProfileForm from "./ProfileForm";
import { useAppContext } from "@/app/app-provider";

export const metadata: Metadata = {
  title: "Hồ sơ người dùng",
};

export default async function MeProfile() {
  return (
    <div>
      <ProfileForm />
    </div>
  );
}
