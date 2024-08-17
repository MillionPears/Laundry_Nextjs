import serviceApiRequest from "@/app/apiRequest/service";
import {
  Service,
  ServicesResType,
} from "@/app/schemaValidations/service.schema";
import DefaultLayout from "@/components/DefaultLayout";
import { cookies } from "next/headers";
import OrderDetailAddForm from "../../_component/OrderDetailAddForm";

export default async function OrderDetailAddPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  let services: ServicesResType["data"] | null = null;
  const orderId = parseInt(params.id);
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
  return <OrderDetailAddForm services={services} orderId={orderId} />;
}
