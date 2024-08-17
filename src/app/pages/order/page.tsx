import { cookies } from "next/headers";

import OrderHistory from "./_components/OrderHistory";
import orderApiRequest from "@/app/apiRequest/order";
import {
  Order,
  OrderResType,
  OrdersResType,
} from "@/app/schemaValidations/order.schema";

export default async function OrderListPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");

  const userId = Number(cookieStore.get("userId")?.value);

  let orders: OrdersResType["data"] | null = null;

  if (sessionToken) {
    const result = await orderApiRequest.orders(userId, sessionToken.value);
    orders = result.payload.data;

    // Xác thực dữ liệu
    orders = orders.map((order) => {
      return Order.parse(order);
    });
  }
  return (
    <div>
      <OrderHistory orders={orders} />
    </div>
  );
}
