// pages/order/[id].tsx
import { Metadata } from "next";
import OrderDetailForm from "../_components/OrderDetail";
import { cookies } from "next/headers";
import orderApiRequest from "@/app/apiRequest/order";
import { OrderDetailResType } from "@/app/schemaValidations/order.schema";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = parseInt(params.id);
  console.log("haha", orderId);
  const cookieStore = cookies();
  let orderDetail: OrderDetailResType["data"] | null = null;
  const sessionToken = cookieStore.get("sessionToken");
  if (sessionToken) {
    const result = await orderApiRequest.getOrderDetail(
      orderId,
      sessionToken.value
    );
    orderDetail = result.payload.data;
    // console.log("haha", orderDetail);
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
