import invoiceApiRequest from "../apiRequest/invoice";
import orderApiRequest from "../apiRequest/order";
import purchaseApiRequest from "../apiRequest/purchase";
import { Invoice, InvoicesResType } from "../schemaValidations/invoice.schema";
import { Order, OrdersResType } from "../schemaValidations/order.schema";
import {
  Purchase,
  PurchaseDetail,
  PurchaseDetailResType,
  PurchasesResType,
} from "../schemaValidations/purchase.schema";
import HomeForm from "./Home";
import { cookies } from "next/headers";

export default async function AdminHomePage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  let purchases: PurchasesResType["data"] | null = null;
  let invoices: InvoicesResType["data"] | null = null;
  let purchaseDetails: PurchaseDetailResType["data"] | null = null;
  let orders: OrdersResType["data"] | null = null;
  if (sessionToken) {
    const result1 = await purchaseApiRequest.getAll(sessionToken.value);
    purchases = result1.payload.data;
    purchases = purchases.map((purchase) => {
      return Purchase.parse(purchase);
    });
    const result2 = await invoiceApiRequest.getAll(sessionToken.value);
    invoices = result2.payload.data;
    invoices = invoices.map((invoice) => {
      return Invoice.parse(invoice);
    });
    const detailResults = await Promise.all(
      purchases.map(async (purchase) => {
        const purchaseDetailResponse =
          await purchaseApiRequest.getPurchaseDetailServer(
            sessionToken.value,
            purchase.purchaseId
          );
        return purchaseDetailResponse.payload.data.map((detail) =>
          PurchaseDetail.parse(detail)
        );
      })
    );
    // Flatten the array of arrays into a single array
    purchaseDetails = detailResults.flat();
    orders = (await orderApiRequest.getAll(sessionToken.value)).payload.data;
    orders = orders.map((order) => {
      return Order.parse(order);
    });
  }

  return (
    <HomeForm
      purchases={purchases}
      invoices={invoices}
      purchaseDetails={purchaseDetails}
      orders={orders}
    />
  );
}
