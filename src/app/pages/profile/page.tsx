import { cookies } from "next/headers";
import type { Metadata } from "next";
import profileApiRequest from "@/app/apiRequest/profile";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = {
  title: "Hồ sơ người dùng",
};

export default async function MeProfile() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  const username = "million";
  const result = await profileApiRequest.profile(
    username,
    sessionToken?.value ?? ""
  );
  return (
    <div>
      <ProfileForm profile={result.payload.data} />
    </div>
  );
}
