import goodsApiRequest from "@/app/apiRequest/goods";
import { Goods, GoodsesResType } from "@/app/schemaValidations/goods.schema";
import { cookies } from "next/headers";
import GoodsManagementForm from "./_component/GoodsManagementForm";

export default async function GoodsManagemntPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  let goodses: GoodsesResType["data"] | null = null;
  if (sessionToken) {
    const result = await goodsApiRequest.getAll(sessionToken.value);
    goodses = result.payload.data;

    // Xác thực dữ liệu
    goodses = goodses.map((goods) => {
      return Goods.parse(goods);
    });
  }
  return <GoodsManagementForm goodses={goodses} />;
}
