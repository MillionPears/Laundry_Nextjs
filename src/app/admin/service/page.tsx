import serviceApiRequest from "@/app/apiRequest/service";
import {
  Service,
  ServicesResType,
} from "@/app/schemaValidations/service.schema";
import DefaultLayout from "@/components/DefaultLayout";
import { cookies } from "next/headers";
import PromotionManagementForm from "./_component/ServiceManagementForm";
import ServiceManagementForm from "./_component/ServiceManagementForm";
import {
  Promotion,
  PromotionsResType,
} from "@/app/schemaValidations/promotion.schema";
import promotionApiRequest from "@/app/apiRequest/promotion";

export default async function ServiceManagementPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  let services: ServicesResType["data"] | null = null;
  let promotions: PromotionsResType["data"] | null = null;
  const userId = Number(cookieStore.get("userId")?.value);
  if (sessionToken) {
    const result = await serviceApiRequest.getAll(sessionToken.value);
    services = result.payload.data;

    // Xác thực dữ liệu
    services = services.map((service) => {
      return Service.parse(service);
    });

    const result2 = await promotionApiRequest.getAll(sessionToken.value);
    promotions = result2.payload.data;
    promotions = promotions.map((promotion) => {
      return Promotion.parse(promotion);
    });
  }

  return (
    <ServiceManagementForm
      services={services}
      promotions={promotions}
      userId={userId}
    />
  );
}
