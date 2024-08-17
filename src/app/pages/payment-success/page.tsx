"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import invoiceApiRequest from "../../apiRequest/invoice";

const PaymentSuccess: React.FC = () => {
  const searchParams = useSearchParams();
  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  useEffect(() => {
    const id = searchParams.get("invoiceId");
    const amountStr = searchParams.get("vnp_Amount");

    if (id && amountStr) {
      const invoice = Number(id);
      const amount = Number(amountStr) / 100;

      setInvoiceId(invoice);
      setTotalPrice(amount);

      // Call API to update invoice status
      const updateInvoiceStatus = async () => {
        try {
          await invoiceApiRequest.updateStatus(invoice);
        } catch (error) {
          console.error("Error updating invoice status:", error);
          alert("Có lỗi xảy ra khi cập nhật trạng thái hóa đơn.");
        }
      };

      updateInvoiceStatus();
    }
  }, [searchParams]);

  if (invoiceId === null || totalPrice === null) {
    return <div>Loading...</div>;
  }

  const formattedPrice = totalPrice.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Thanh toán thành công!
        </h1>
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h2 className="text-2xl font-semibold text-green-600 mb-2">
            Chi tiết hóa đơn
          </h2>
          <p className="text-lg mb-1">
            <span className="font-medium">Hóa đơn:</span> {invoiceId}
          </p>
          <p className="text-lg">
            <span className="font-medium">Số tiền thanh toán:</span>{" "}
            {formattedPrice}
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/admin/invoice")}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Quay lại trang quản lý hóa đơn
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
