import {
  Service,
  ServicesResType,
} from "@/app/schemaValidations/service.schema";
import serviceApiRequest from "@/app/apiRequest/service";
import DefaultLayout from "@/components/DefaultLayout";
import { cookies } from "next/headers";
import PromotionInfoForm from "../_component/PromotionInfoForm";
import { PromotionResType } from "@/app/schemaValidations/promotion.schema";
import promotionApiRequest from "@/app/apiRequest/promotion";

export default async function PromotionUpdatePage({
  params,
}: {
  params: { id: number };
}) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  let services: ServicesResType["data"] | null = null;
  let promotion: PromotionResType["data"] | null = null;
  if (sessionToken) {
    const result = await serviceApiRequest.getByPromotionId(
      params.id,
      sessionToken.value
    );
    services = result.payload.data;
    const result2 = await promotionApiRequest.getById(
      params.id,
      sessionToken.value
    );
    promotion = result2.payload.data;

    // Xác thực dữ liệu
    services = services.map((service) => {
      return Service.parse(service);
    });
  }

  return (
    <PromotionInfoForm
      services={services}
      params={params}
      promotion={promotion}
    />
  );
}
