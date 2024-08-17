import DefaultLayout from "@/components/DefaultLayout";
import ServiceAddForm from "../_component/ServiceAddForm";
import { cookies } from "next/headers";

export default async function ServiceCreatePage() {
  const cookieStore = cookies();

  const userId = Number(cookieStore.get("userId")?.value);

  return <ServiceAddForm userId={userId} />;
}
