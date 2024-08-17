"use client";

import orderApiRequest from "@/app/apiRequest/order";
import { OrdersResType } from "@/app/schemaValidations/order.schema";
import Alert from "@/components/Alert";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaCalendarAlt,
  FaSave,
} from "react-icons/fa";

const OrderManagementPage = ({
  orders,
}: {
  orders: OrdersResType["data"] | null;
}) => {
  const deliveryMethodMap: { [key: number]: string } = {
    1: "nhận hàng tại cửa hàng",
    2: "giao hàng",
  };
  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const [filteredOrders, setFilteredOrders] = useState<
    OrdersResType["data"] | null
  >(null);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const statuses = [
    { label: "vừa tạo", value: 0 },
    { label: "đã nhận đơn hàng", value: 1 },
    { label: "đang trong quá trình giặt", value: 2 },
    { label: "đã hoàn thành", value: 3 },
  ];

  useEffect(() => {
    const statusFromParams = searchParams.get("status");
    if (statusFromParams) {
      const statusIndex = statuses.findIndex(
        (status) => status.label === statusFromParams
      );
      if (statusIndex !== -1) {
        setSelectedStatus(statuses[statusIndex].value);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (orders) {
      let filtered = orders.filter((order) => order.status === selectedStatus);
      if (startDate) {
        filtered = filtered.filter(
          (order) => new Date(order.orderDate) >= startDate
        );
      }
      if (endDate) {
        filtered = filtered.filter(
          (order) => new Date(order.orderDate) <= endDate
        );
      }
      setFilteredOrders(filtered);
    }
  }, [selectedStatus, startDate, endDate, orders]);

  const handleStatusChange = (status: number) => {
    setSelectedStatus(status);
    const newUrl = new URL(window.location.href);
    const statusLabel = statuses.find((s) => s.value === status)?.label;
    if (statusLabel) {
      newUrl.searchParams.set("status", statusLabel);
    }
    router.replace(newUrl.pathname + newUrl.search);
  };

  const handleDetailClick = (orderId: number) => {
    const statusLabel = statuses.find((s) => s.value === selectedStatus)?.label;
    router.push(`/admin/order/${orderId}?status=${statusLabel}`);
  };

  const handleAddDetailClick = (orderId: number) => {
    router.push(`/admin/order/${orderId}/add`);
  };

  const handleUpdateStatusClick = (orderId: number) => {
    setEditingOrderId(orderId);
    setNewStatus(0);
  };

  const handleSaveStatusClick = async (
    orderId: number,
    currentStatus: number
  ) => {
    if (newStatus > currentStatus) {
      try {
        const result = await orderApiRequest.updateStatus(orderId, newStatus);
        Alert.success("Thành công!", "Trạng thái đơn hàng đã được cập nhật.");
        router.refresh();
      } catch (error) {
        Alert.error("Lỗi", "Không thể cập nhật trạng thái đơn hàng.");
      } finally {
        setEditingOrderId(null);
        setNewStatus(0);
      }
    } else {
      Alert.error("Lỗi", "Không thể cập nhật trạng thái đơn hàng ngược lại.");
    }
  };

  const handleDeleteClick = async (orderId: number) => {
    try {
      const result = await orderApiRequest.deleteOrder(orderId);

      Alert.success("Thành công!", result.payload.message);
      router.push("/admin/order");
      router.refresh();
    } catch (error) {
      Alert.error("Lỗi", "Lỗi khi xóa đơn hàng");
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date ?? undefined);
    if (date && endDate && endDate <= date) {
      setEndDate(undefined);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!startDate || (date && date > startDate)) {
      setEndDate(date ?? undefined);
    }
  };
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 5;
  const totalPages = Math.ceil((filteredOrders?.length || 0) / ordersPerPage);

  const currentOrders = filteredOrders
    ? filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
      )
    : [];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const getOrderCountByStatus = (status: number) => {
    return orders?.filter((order) => order.status === status).length || 0;
  };

  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="mb-6 flex flex-wrap items-center">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            className={`mr-2 mb-2 px-4 py-2 rounded text-sm transition-all duration-300 ${
              selectedStatus === status.value
                ? "bg-blue-400 text-blue-900 shadow-lg transform scale-105"
                : "bg-white text-blue-500 border border-blue-300 hover:bg-blue-100"
            }`}
          >
            <span className="mr-2">{status.label}</span>(
            <span className="text-red-500 font-bold">
              {getOrderCountByStatus(status.value)}
            </span>
            )
          </button>
        ))}

        <div className="flex items-center mb-4 space-x-4">
          <FaCalendarAlt className="text-blue-500 text-lg" />
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="px-2 py-1 text-sm border border-blue-300 rounded bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-40"
            placeholderText="Từ ngày"
            dateFormat="dd/MM/yyyy"
          />
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            className="px-2 py-1 text-sm border border-blue-300 rounded bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-40"
            placeholderText="Đến ngày"
            dateFormat="dd/MM/yyyy"
            minDate={startDate}
            disabled={!startDate}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-blue-300 shadow-lg rounded-lg text-sm">
          <thead className="bg-blue-200 text-blue-800">
            <tr>
              <th className="px-6 py-3 border-b border-blue-300">
                Mã đơn hàng
              </th>
              <th className="px-6 py-3 border-b border-blue-300">
                Tên khách hàng
              </th>
              <th className="px-6 py-3 border-b border-blue-300">Ngày đặt</th>
              <th className="px-6 py-3 border-b border-blue-300">Ngày giao</th>
              <th className="px-6 py-3 border-b border-blue-300">
                Phương thức nhận hàng
              </th>
              <th className="px-6 py-3 border-b border-blue-300">Địa chỉ</th>
              <th className="px-6 py-3 border-b border-blue-300">
                Số điện thoại
              </th>
              <th className="px-6 py-3 border-b border-blue-300">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders && filteredOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-blue-100 transition-colors duration-300"
                >
                  <td className="px-6 py-3 border-b border-blue-300">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {order.orderDate}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {order.deadline}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {deliveryMethodMap[order.deliveryTypeId]}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    <span
                      className="block max-w-[10rem] truncate"
                      title={order.address}
                    >
                      {order.address}
                    </span>
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {order.phoneNumber}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300 flex space-x-2">
                    {selectedStatus === 3 ? (
                      <>
                        <button
                          onClick={() => handleDetailClick(order.orderId)}
                          className="p-2 text-sm rounded bg-blue-400 text-blue-900 shadow-lg transition-transform transform hover:scale-105"
                        >
                          <FaInfoCircle />
                        </button>
                      </>
                    ) : selectedStatus === 0 ? (
                      <>
                        <button
                          onClick={() => handleAddDetailClick(order.orderId)}
                          className="p-2 text-sm rounded bg-blue-400 text-blue-900 shadow-lg transition-transform transform hover:scale-105"
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(order.orderId)}
                          className="p-2 text-sm rounded bg-red-400 text-red-900 shadow-lg transition-transform transform hover:scale-105"
                        >
                          <FaTrash />
                        </button>
                        {editingOrderId === order.orderId ? (
                          <>
                            <select
                              value={newStatus}
                              onChange={(e) =>
                                setNewStatus(parseInt(e.target.value))
                              }
                              className="px-2 py-1 border border-blue-300 rounded bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              <option value={0}>Chọn trạng thái</option>
                              {statuses
                                .filter((status) => status.value > order.status) // Chỉ hiển thị trạng thái mới hơn
                                .map((status) => (
                                  <option
                                    key={status.value}
                                    value={status.value}
                                  >
                                    {status.label}
                                  </option>
                                ))}
                            </select>
                            <button
                              onClick={() =>
                                handleSaveStatusClick(
                                  order.orderId,
                                  order.status
                                )
                              }
                              className="p-2 text-sm rounded bg-green-400 text-green-900 shadow-lg transition-transform transform hover:scale-105"
                            >
                              <FaSave />
                            </button>
                          </>
                        ) : null}
                      </>
                    ) : (
                      <>
                        {selectedStatus === 1 || selectedStatus === 2 ? (
                          <>
                            {editingOrderId === order.orderId ? (
                              <>
                                <select
                                  value={newStatus}
                                  onChange={(e) =>
                                    setNewStatus(parseInt(e.target.value))
                                  }
                                  className="px-2 py-1 border border-blue-300 rounded bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                  <option value={0}>Chọn trạng thái</option>
                                  {statuses
                                    .filter(
                                      (status) => status.value > order.status
                                    ) // Chỉ hiển thị trạng thái mới hơn
                                    .map((status) => (
                                      <option
                                        key={status.value}
                                        value={status.value}
                                      >
                                        {status.label}
                                      </option>
                                    ))}
                                </select>
                                <button
                                  onClick={() =>
                                    handleSaveStatusClick(
                                      order.orderId,
                                      order.status
                                    )
                                  }
                                  className="p-2 text-sm rounded bg-green-400 text-green-900 shadow-lg transition-transform transform hover:scale-105"
                                >
                                  <FaSave />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleDetailClick(order.orderId)
                                  }
                                  className="p-2 text-sm rounded bg-blue-400 text-blue-900 shadow-lg transition-transform transform hover:scale-105"
                                >
                                  <FaInfoCircle />
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateStatusClick(order.orderId)
                                  }
                                  className="p-2 text-sm rounded bg-yellow-400 text-yellow-900 shadow-lg transition-transform transform hover:scale-105"
                                >
                                  <FaEdit />
                                </button>
                              </>
                            )}
                          </>
                        ) : null}
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Không có đơn hàng nào trong trạng thái này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default OrderManagementPage;
