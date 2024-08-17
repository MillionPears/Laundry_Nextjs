"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useAppContext } from "@/app/app-provider";
import { CreateOrderBodyType } from "@/app/schemaValidations/order.schema";
import { useRouter } from "next/navigation";
import orderApiRequest from "@/app/apiRequest/order";
import Alert from "@/components/Alert";

export default function AppointmentAddPage() {
  const { user } = useAppContext();

  const router = useRouter();
  const [formData, setFormData] = useState<CreateOrderBodyType>({
    orderDate: "",
    note: "",
    deadline: "",
    customerId: user?.id,
    deliveryTypeId: 1,
    phoneNumber: user?.phoneNumber || "",
    address: "",
    email: user?.email || "",
  });

  const truncateAddress = (address: string, maxLength: number) => {
    if (address.length > maxLength) {
      return `${address.substring(0, maxLength)}...`;
    }
    return address;
  };

  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const updatedValue = name === "deliveryTypeId" ? Number(value) : value;
    setFormData({ ...formData, [name]: updatedValue });

    if (name === "phoneNumber") {
      const phonePattern = /^0[35789]\d{8}$/;
      if (!phonePattern.test(value)) {
        setPhoneError("Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.");
      } else {
        setPhoneError(null);
      }
    }

    if (name === "orderDate") {
      setError(null);
      if (!value) {
        setFormData({ ...formData, deadline: "" });
      }
    }

    if (name === "deadline") {
      if (formData.orderDate && value) {
        const deliveryDate = new Date(formData.orderDate);
        const threeDaysLater = new Date(
          deliveryDate.setDate(deliveryDate.getDate() + 3)
        );

        if (new Date(value) > threeDaysLater) {
          setError(
            "Thời gian nhận đồ không được vượt quá 3 ngày kể từ ngày giao đồ."
          );
        } else {
          setError(null);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await orderApiRequest.createOrder(formData);
      Alert.success("Thành công!", response.payload.message);
      router.push("/pages/order");
      router.refresh();
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Có lỗi xảy ra khi tạo lịch hẹn. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
        Tạo lịch hẹn mới
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="orderDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày giao đồ
            </label>
            <input
              type="datetime-local"
              id="orderDate"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày nhận đồ
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={
                formData.orderDate
                  ? format(new Date(formData.orderDate), "yyyy-MM-dd")
                  : undefined
              }
              max={
                formData.orderDate
                  ? format(
                      new Date(
                        new Date(formData.orderDate).getTime() +
                          3 * 24 * 60 * 60 * 1000
                      ),
                      "yyyy-MM-dd"
                    )
                  : undefined
              }
              disabled={!formData.orderDate}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                !formData.orderDate && "bg-gray-200"
              }`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700"
          >
            Ghi chú
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
            placeholder="Nhập ghi chú (nếu có)"
          />
        </div>

        <div>
          <label
            htmlFor="deliveryMethod"
            className="block text-sm font-medium text-gray-700"
          >
            Phương thức vận chuyển
          </label>
          <select
            id="deliveryMethod"
            name="deliveryTypeId"
            value={formData.deliveryTypeId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value={1}>Nhận hàng trực tiếp</option>
            <option value={2}>Thông qua đơn vị vận chuyển</option>
          </select>
        </div>

        {formData.deliveryTypeId === 2 && (
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Địa chỉ nhận
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nhập địa chỉ nhận"
            />
            {/* <p className="text-sm text-gray-600">
              {truncateAddress(formData.address, 20)}
            </p> */}
          </div>
        )}

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Số điện thoại người nhận
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập số điện thoại người nhận"
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-2">{phoneError}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập email người nhận"
          />
        </div>

        <div>
          <label
            htmlFor="recipientName"
            className="block text-sm font-medium text-gray-700"
          >
            Họ tên người nhận
          </label>
          <input
            type="text"
            id="recipientName"
            name="recipientName"
            value={user?.name || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập họ tên người nhận"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-6">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tạo lịch hẹn
          </button>
        </div>
      </form>
    </div>
  );
}
