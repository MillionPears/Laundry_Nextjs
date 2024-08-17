import { cookies } from "next/headers";
import { Order, OrdersResType } from "@/app/schemaValidations/order.schema";
import orderApiRequest from "@/app/apiRequest/order";
import OrderShipmentForm from "../_component/OrderShipmentForm";

export default async function OrderShipmentPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  let orders: OrdersResType["data"] | null = null;
  if (sessionToken) {
    const result = await orderApiRequest.getListOrderShipment(
      sessionToken.value
    );
    orders = result.payload.data;
    // Xác thực dữ liệu
    orders = orders.map((order) => {
      return Order.parse(order);
    });
  }
  return <OrderShipmentForm orders={orders} />;
}
