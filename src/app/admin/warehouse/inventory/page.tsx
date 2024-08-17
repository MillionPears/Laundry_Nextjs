import purchaseApiRequest from "@/app/apiRequest/purchase";
import {
  Purchase,
  PurchasesResType,
} from "@/app/schemaValidations/purchase.schema";
import { cookies } from "next/headers";
import PurchaseManagementForm from "../_component/PurchaseManagement";
import { Goods, GoodsesResType } from "@/app/schemaValidations/goods.schema";
import goodsApiRequest from "@/app/apiRequest/goods";

export default async function PurchaseManagemntPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  let purchases: PurchasesResType["data"] | null = null;
  let goodses: GoodsesResType["data"] | null = null;
  if (sessionToken) {
    const result1 = await purchaseApiRequest.getAll(sessionToken.value);
    purchases = result1.payload.data;
    const result2 = await goodsApiRequest.getAll(sessionToken.value);
    goodses = result2.payload.data;
    // Xác thực dữ liệu
    purchases = purchases.map((purchase) => {
      return Purchase.parse(purchase);
    });
    goodses = goodses.map((goods) => {
      return Goods.parse(goods);
    });
  }
  return <PurchaseManagementForm purchases={purchases} goodses={goodses} />;
}
