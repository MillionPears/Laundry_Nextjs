// src/pages/OrderManagementPage.tsx

import DefaultLayout from "@/components/DefaultLayout";
import OrderManagementPage from "./_component/OrderManagement";
import { cookies } from "next/headers";
import { Order, OrdersResType } from "@/app/schemaValidations/order.schema";
import orderApiRequest from "@/app/apiRequest/order";

export default async function OrderManagementHomePage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  let orders: OrdersResType["data"] | null = null;
  if (sessionToken) {
    const result = await orderApiRequest.getAll(sessionToken.value);
    orders = result.payload.data;
    // Xác thực dữ liệu
    orders = orders.map((order) => {
      return Order.parse(order);
    });
  }
  return <OrderManagementPage orders={orders} />;
}
