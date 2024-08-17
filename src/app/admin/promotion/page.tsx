import DefaultLayout from "@/components/DefaultLayout";
import PromotionManagementForm from "./_component/PromotionManagementForm";
import { cookies } from "next/headers";
import {
  Promotion,
  PromotionsResType,
} from "@/app/schemaValidations/promotion.schema";
import promotionApiRequest from "@/app/apiRequest/promotion";

export default async function PromotionManagementHomePage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");

  let promotions: PromotionsResType["data"] | null = null;
  if (sessionToken) {
    const result = await promotionApiRequest.getAll(sessionToken.value);
    promotions = result.payload.data;
    // Xác thực dữ liệu
    promotions = promotions.map((promotion) => {
      return Promotion.parse(promotion);
    });
  }
  return <PromotionManagementForm promotions={promotions} />;
}
