"use client";

// src/app/orders/page.tsx
import React from "react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const orders = [
  {
    id: 1,
    orderDate: "2023-07-01",
    deliveryDate: "2023-07-05",
    status: "Completed",
    amount: "$20",
    deliveryType: "Nhận hàng trực tiếp",
  },
  {
    id: 2,
    orderDate: "2023-07-02",
    deliveryDate: "2023-07-06",
    status: "Pending",
    amount: "$15",
    deliveryType: "Thông qua đơn vị vận chuyển",
  },
  {
    id: 3,
    orderDate: "2023-07-03",
    deliveryDate: "2023-07-07",
    status: "Cancelled",
    amount: "$0",
    deliveryType: "Nhận hàng trực tiếp",
  },
  {
    id: 3,
    orderDate: "2023-07-03",
    deliveryDate: "2023-07-07",
    status: "Cancelled",
    amount: "$0",
    deliveryType: "Nhận hàng trực tiếp",
  },
  // Add more orders as needed
];

const OrderHistory = () => {
  const router = useRouter();

  const handleViewDetails = (id: number) => {
    // Redirect to order details page
    router.push(`/orders/${id}`);
  };

  const handleCreateAppointment = () => {
    // Redirect to appointment creation page
    router.push("/create-appointment");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-blue-800">Lịch sử đơn hàng</h1>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Ngày nhận
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Loại giao hàng
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.orderDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.deliveryDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.deliveryType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleCreateAppointment}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full absolute bottom-4 right-4 transition duration-300 transform hover:scale-105"
        >
          Tạo lịch hẹn mới
        </button>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default OrderHistory;
