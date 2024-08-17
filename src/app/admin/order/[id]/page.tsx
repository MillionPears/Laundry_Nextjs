import orderApiRequest from "@/app/apiRequest/order";
import { OrderDetailResType } from "@/app/schemaValidations/order.schema";
import { Metadata } from "next";
import { cookies } from "next/headers";
import OrderDetailForm from "../_component/OrderDetailForm";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = parseInt(params.id);

  const cookieStore = cookies();
  let orderDetail: OrderDetailResType["data"] | null = null;
  const sessionToken = cookieStore.get("sessionToken");
  if (sessionToken) {
    const result = await orderApiRequest.getOrderDetail(
      orderId,
      sessionToken.value
    );
    orderDetail = result.payload.data;
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      {/* <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Order Details for Order ID: {orderId}
      </h2> */}
      {/* Render OrderDetailForm directly */}
      <OrderDetailForm orderDetail={orderDetail} />
    </div>
  );
}
