"use client";

import Image from "next/image";
import {
  OrderDetailResType,
  OrdersResType,
} from "@/app/schemaValidations/order.schema";
import { useEffect, useState } from "react";
import AlertComponent, { OrderItem } from "@/components/Alert";
import orderApiRequest from "@/app/apiRequest/order";
import { FaCheckCircle, FaTruck } from "react-icons/fa";
import Alert from "@/components/Alert";
import { useRouter } from "next/navigation";

const OrderShipmentForm = ({
  orders,
}: {
  orders: OrdersResType["data"] | null;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 8; // Number of orders per page
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const getImagePath = (imageName: string) => {
    return `/image/${imageName}.png`; // Change path as needed
  };
  const router = useRouter();

  // Map statuses to colors
  const statusColors: Record<number, string> = {
    1: "bg-red-100", // Preparing (now red)
    2: "bg-blue-100", // In transit
    3: "bg-green-100", // Completed
  };

  // Map button statuses to colors
  const buttonColors: Record<number, string> = {
    1: "bg-red-500 hover:bg-red-600", // Preparing
    2: "bg-blue-500 hover:bg-blue-600", // In transit
    3: "bg-green-500 hover:bg-green-600", // Completed
  };

  const filterOrders = (status: number | null) => {
    if (status === null) return orders;
    return orders?.filter((order) => order.deliveryStatus === status) || [];
  };

  const paginatedOrders = (orders: OrdersResType["data"] | null) => {
    const filteredOrders = filterOrders(selectedStatus);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return filteredOrders?.slice(startIndex, endIndex) || [];
  };

  const totalPages = Math.ceil(
    (filterOrders(selectedStatus)?.length || 0) / ordersPerPage
  );

  const getCardColor = (status: number) => {
    return statusColors[status] || "bg-white";
  };

  useEffect(() => {
    if (selectedOrderId !== null) {
      handleOrderClick(selectedOrderId);
    }
  }, [selectedOrderId]);

  const handleOrderClick = async (orderId: number) => {
    try {
      const response = await orderApiRequest.getOrderDetailClient(orderId);
      const orderDetails = response.payload.data;

      const totalAmount = orderDetails.reduce(
        (total, item) => total + item.amount * item.price,
        0
      );

      const orderDetail = {
        orderId,
        items: orderDetails.map((detail) => ({
          serviceName: detail.serviceName,
          quantity: detail.amount,
          price: detail.price,
          total: detail.amount * detail.price,
        })),
        totalAmount,
      };

      AlertComponent.orderDetails(orderDetail);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleUpdateStatus = async (
    orderId: number,
    newStatus: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    let message = "";
    if (newStatus === 2) {
      message = "Order is in transit";
    } else {
      message = "Order completed successfully";
    }
    try {
      await orderApiRequest.updateDeliveryStatus(orderId, newStatus);
      Alert.success("Success!", message);
      router.refresh();
    } catch (error) {
      Alert.error("Error", "Unable to update delivery status.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Filter buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(buttonColors).map(([status, colorClass]) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(Number(status))}
            className={`px-4 py-2 text-white rounded transition-colors duration-300 ease-in-out ${
              selectedStatus === Number(status)
                ? `${colorClass} shadow-lg`
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {status === "1"
              ? "Đang chuẩn bị"
              : status === "2"
              ? "Đang giao"
              : "Đã giao"}
          </button>
        ))}
        <button
          onClick={() => setSelectedStatus(null)}
          className={`px-4 py-2 text-black rounded transition-colors duration-300 ease-in-out ${
            selectedStatus === null
              ? "bg-gray-400 shadow-lg"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Tất cả
        </button>
      </div>

      {/* Order cards */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        style={{ gridTemplateRows: "repeat(2, minmax(0, 1fr))" }}
      >
        {paginatedOrders(orders)?.map((order) => (
          <div
            key={order.orderId}
            className={`relative shadow-md rounded-lg overflow-hidden ${getCardColor(
              order.deliveryStatus
            )} transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer`}
            onClick={() => handleOrderClick(order.orderId)}
          >
            <div className="flex p-4">
              <div className="w-1/3">
                <Image
                  src={getImagePath("boy")}
                  alt="Avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              <div className="w-2/3 text-right">
                <p className="text-sm font-semibold">
                  Mã đơn hàng: {order.orderId}
                </p>
                <p className="text-sm">{order.customerName}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <p className="text-sm">Số điện thoại: {order.phoneNumber}</p>
              <p className="text-sm">Địa chỉ: {order.address}</p>
            </div>
            {/* Status update options */}
            <div
              className={`absolute inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                order.deliveryStatus === 3 ? "hidden" : ""
              }`}
            >
              <div className="flex gap-4">
                {order.deliveryStatus === 1 && (
                  <>
                    <button
                      className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={(event) =>
                        handleUpdateStatus(order.orderId, 2, event)
                      }
                    >
                      <FaTruck className="text-xl" />
                      Đang giao
                    </button>
                    <button
                      className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={(event) =>
                        handleUpdateStatus(order.orderId, 3, event)
                      }
                    >
                      <FaCheckCircle className="text-xl" />
                      Đã giao
                    </button>
                  </>
                )}
                {order.deliveryStatus === 2 && (
                  <button
                    className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={(event) =>
                      handleUpdateStatus(order.orderId, 3, event)
                    }
                  >
                    <FaCheckCircle className="text-xl" />
                    Đã giao
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
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
          Trước
        </button>
        <span className="px-4 py-2 text-sm text-gray-600">
          Trang {currentPage} của {totalPages}
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
          Sau
        </button>
      </div>
    </div>
  );
};

export default OrderShipmentForm;
