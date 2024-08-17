"use client";

import { PurchasesResType } from "@/app/schemaValidations/purchase.schema";
import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import AlertComponent from "@/components/Alert";
import purchaseApiRequest from "@/app/apiRequest/purchase";
import { GoodsesResType } from "@/app/schemaValidations/goods.schema";

const PurchaseManagementForm = ({
  purchases,
  goodses,
}: {
  purchases: PurchasesResType["data"] | null;
  goodses: GoodsesResType["data"] | null;
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const purchasesPerPage = 12;

  const paginatedPurchases = (purchases: PurchasesResType["data"] | null) => {
    if (!purchases) return [];
    const startIndex = (currentPage - 1) * purchasesPerPage;
    const endIndex = startIndex + purchasesPerPage;
    return purchases.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil((purchases?.length || 0) / purchasesPerPage);

  const currentPurchases = paginatedPurchases(purchases);
  const router = useRouter();
  const handleCreatePurchase = () => {
    // Redirect to a page where you can create a new purchase
    router.push("/admin/warehouse/add-purchase"); // Assuming you have a route for creating a purchase
  };
  const handlePurchaseClick = async (purchaseId: number) => {
    try {
      // Thay đổi hàm API để lấy thông tin phiếu nhập
      const response = await purchaseApiRequest.getPurchaseDetail(purchaseId); // Giả định bạn có hàm này
      const purchaseDetails = response.payload.data;

      // Tính tổng tiền
      const totalAmount = purchaseDetails.reduce(
        (total, item) => total + item.amount * item.priceIncome,
        0
      );

      // Tạo đối tượng phiếu nhập
      const purchaseDetail = {
        purchaseId,
        items: purchaseDetails.map((detail) => ({
          goodsName: detail.goodsName, // Ensure goodsName is available in the response
          quantity: detail.amount,
          price: detail.priceIncome,
          total: detail.amount * detail.priceIncome,
        })),
        totalAmount,
      };

      // Hiển thị chi tiết phiếu nhập
      AlertComponent.purchaseDetails(purchaseDetail);
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    }
  };
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleCreatePurchase}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
        >
          Tạo phiếu nhập
        </button>
      </div>
      <div
        className="grid grid-cols-4 gap-6"
        style={{ gridTemplateRows: "repeat(3, minmax(0, 1fr))" }}
      >
        {currentPurchases.map((purchase) => (
          <div
            key={purchase.purchaseId}
            className="relative shadow-lg rounded-lg overflow-hidden p-4 bg-white border border-gray-200"
            onClick={() => handlePurchaseClick(purchase.purchaseId)} // Thêm sự kiện click
          >
            <div className="mb-4">
              <p className="text-lg font-semibold">
                Mã phiếu nhập: {purchase.purchaseId}
              </p>
              <p className="text-sm">
                Ngày tạo: {format(new Date(purchase.dateCreate), "dd/MM/yyyy")}
              </p>
              <p className="text-sm">Nhân viên tạo: {purchase.staffId}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 text-white rounded transition-colors duration-300 ease-in-out ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className={`px-4 py-2 text-white rounded transition-colors duration-300 ease-in-out ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PurchaseManagementForm;
