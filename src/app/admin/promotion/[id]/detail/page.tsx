import {
  Service,
  ServicesResType,
} from "@/app/schemaValidations/service.schema";
import serviceApiRequest from "@/app/apiRequest/service";
import DefaultLayout from "@/components/DefaultLayout";
import { cookies } from "next/headers";

import PromotionDetailForm from "../../_component/PromotionDetailForm";

export default async function PromotionUpdatePage({
  params,
}: {
  params: { id: number };
}) {
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
  return <PromotionDetailForm services={services} params={params} />;
}
