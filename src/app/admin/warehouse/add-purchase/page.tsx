import goodsApiRequest from "@/app/apiRequest/goods";
import { Goods, GoodsesResType } from "@/app/schemaValidations/goods.schema";
import { cookies } from "next/headers";
import PurchaseAddForm from "../_component/PurchaseAddForm";

export default async function PurchaseAddpagePage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  const employeeId = Number(cookieStore.get("userId")?.value);
  let goodses: GoodsesResType["data"] | null = null;
  if (sessionToken) {
    const result = await goodsApiRequest.getAll(sessionToken.value);
    goodses = result.payload.data;

    // Xác thực dữ liệu
    goodses = goodses.map((goods) => {
      return Goods.parse(goods);
    });
  }
  return <PurchaseAddForm goodses={goodses} employeeId={employeeId} />;
}
