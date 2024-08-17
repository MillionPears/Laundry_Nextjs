import staffApiRequest from "@/app/apiRequest/staff";
import { Staff, StaffsResType } from "@/app/schemaValidations/staff.schema";
import DefaultLayout from "@/components/DefaultLayout";
import { cookies } from "next/headers";
import ServiceManagementForm from "./_component/StaffManagementForm";

export default async function StaffManagementPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  let staffs: StaffsResType["data"] | null = null;

  if (sessionToken) {
    const result = await staffApiRequest.getAll(sessionToken.value);
    staffs = result.payload.data;

    // Xác thực dữ liệu
    staffs = staffs.map((service) => {
      return Staff.parse(service);
    });
  }

  return <ServiceManagementForm staffs={staffs} />;
}
