// components/OrderDetailForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import { OrderDetailResType } from "@/app/schemaValidations/order.schema";
import Alert from "@/components/Alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const OrderDetailForm = ({
  orderDetail,
}: {
  orderDetail: OrderDetailResType["data"] | null;
}) => {
  const [isOpen, setIsOpen] = useState(true); // Mở modal khi component được render
  const router = useRouter();

  if (!orderDetail) {
    return <p>Không có chi tiết cho đơn hàng này</p>;
  }

  const total = orderDetail.reduce(
    (sum, item) => sum + item.amount * item.price,
    0
  );

  const handleClose = () => {
    setIsOpen(false);

    router.push("/pages/order");
    // Bạn có thể chuyển hướng về trang danh sách đơn hàng hoặc trang chính ở đây
  };

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-200 via-transparent to-blue-50 z-10" />

      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="p-6 bg-white rounded-lg shadow-lg border border-blue-200 relative z-20">
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
        </div>
      </Modal>
    </>
  );
};

export default OrderDetailForm;
