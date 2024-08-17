"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OrdersResType } from "@/app/schemaValidations/order.schema";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import orderApiRequest from "@/app/apiRequest/order";
import Alert from "@/components/Alert";

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year
  return `${day}/${month}/${year}`;
};

const OrderHistory = ({ orders }: { orders: OrdersResType["data"] | null }) => {
  const orderStatusMap: { [key: number]: string } = {
    0: "vừa tạo",
    1: "đã nhận đơn hàng",
    2: "đang trong quá trình giặt",
    3: "đã hoàn thành",
  };
  const deliveryMethodMap: { [key: number]: string } = {
    1: "nhận hàng tại cửa hàng",
    2: "giao hàng",
  };
  const router = useRouter();

  const ordersPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<number | null>(null);

  // Calculate total pages
  const totalPages = Math.ceil((orders?.length ?? 0) / ordersPerPage);

  // Apply filters to orders
  const filteredOrders =
    orders?.filter((order) => {
      const matchesDate = filterDate ? order.orderDate === filterDate : true;
      const matchesStatus =
        filterStatus !== null ? order.status === filterStatus : true;
      return matchesDate && matchesStatus;
    }) ?? [];

  // Sort orders by orderDate in descending order
  const sortedOrders = filteredOrders.sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  // Get orders for the current page
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (id: number) => {
    router.push(`/pages/order/${id}`);
  };

  const handleCreateAppointment = () => {
    router.push("/pages/order/add");
  };

  const handleUpdate = (id: number) => {};

  const handleDelete = async (id: number) => {
    try {
      const result = await orderApiRequest.deleteOrder(id);

      Alert.success("Thành công!", result.payload.message);
      router.push("/pages/order");
      router.refresh();
    } catch (error) {
      Alert.error("Lỗi", "Lỗi khi xóa đơn hàng");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-blue-800">Lịch sử đơn hàng</h1>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <input
              type="date"
              value={filterDate ?? ""}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            />
            <select
              value={filterStatus !== null ? filterStatus : ""}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Tất cả trạng thái</option>
              {Object.entries(orderStatusMap).map(([status, label]) => (
                <option key={status} value={status}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreateAppointment}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
          >
            Tạo lịch hẹn mới
          </button>
        </div>

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
                Số điện thoại nhận
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Phương thức nhận hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Địa chỉ nhận
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Trạng thái đơn hàng
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedOrders.map((order) => (
              <tr key={order.orderId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(order.orderDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(order.deadline)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {deliveryMethodMap[order.deliveryTypeId]}
                </td>
                <td className="relative group">
                  <span>
                    {order.address
                      ? order.address.length > 20
                        ? `${order.address.slice(0, 20)}...`
                        : order.address
                      : "nhận trực tiếp tại cửa hàng"}
                  </span>
                  {order.address && (
                    <div className="absolute left-0 bottom-full mb-2 hidden w-max max-w-xs rounded bg-gray-800 p-2 text-sm text-white opacity-75 shadow-md group-hover:block">
                      {order.address}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {orderStatusMap[order.status]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {order.status === 0 && (
                    <>
                      {/* <button
                        onClick={() => handleUpdate(order.orderId)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
                      >
                        <FaEdit />
                      </button> */}
                      <button
                        onClick={() => handleDelete(order.orderId)}
                        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <FaTrashAlt />
                      </button>
                    </>
                  )}
                  {order.status !== 0 && (
                    <>
                      <button
                        onClick={() => handleViewDetails(order.orderId)}
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                      >
                        <FaEye />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex justify-between">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
          >
            Previous
          </button>
          <span className="self-center text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
