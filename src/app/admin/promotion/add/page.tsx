import DefaultLayout from "@/components/DefaultLayout";
import PromotionAddForm from "../_component/PromotionAddForm";
import { cookies } from "next/headers";
import {
  Service,
  ServicesResType,
} from "@/app/schemaValidations/service.schema";
import serviceApiRequest from "@/app/apiRequest/service";

export default async function PromotionAddPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  const userId = Number(cookieStore.get("userId")?.value);
  let services: ServicesResType["data"] | null = null;
  if (sessionToken) {
    const result = await serviceApiRequest.getAllByStatus(
      1,
      sessionToken.value
    );
    services = result.payload.data;
    // Xác thực dữ liệu
    services = services.map((service) => {
      return Service.parse(service);
    });
  }
  return <PromotionAddForm userId={userId} />;
}
