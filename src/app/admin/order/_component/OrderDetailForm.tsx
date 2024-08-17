"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderDetailResType } from "@/app/schemaValidations/order.schema";

const OrderDetailForm = ({
  orderDetail,
}: {
  orderDetail: OrderDetailResType["data"] | null;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedStatus = searchParams.get("status") || "vừa tạo";

  if (!orderDetail) {
    return <p>Không có chi tiết cho đơn hàng này</p>;
  }

  const total = orderDetail.reduce(
    (sum, item) => sum + item.amount * item.price,
    0
  );

  const handleClose = () => {
    setIsOpen(false);
    router.push(`/admin/order?status=${selectedStatus}`);
  };

  // Prevent background scrolling when the modal is open
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto"; // Cleanup
    };
  }, [isOpen]);

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-60 z-40"
          onClick={handleClose}
        />
      )}

      {/* Modal Container */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <div className="p-6 bg-white rounded-lg shadow-lg border border-blue-200 w-full max-w-3xl relative">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
              Chi tiết đơn hàng
            </h2>
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Tên dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderDetail.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                      {item.serviceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                      {item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                      {item.price.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                      {(item.amount * item.price).toLocaleString()} VND
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td
                    colSpan={3}
                    className="px-6 py-4 whitespace-nowrap text-right text-blue-700"
                  >
                    Tổng cộng:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                    {total.toLocaleString()} VND
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetailForm;
