"use client";
import { useState } from "react";
import { format } from "date-fns";
import { useAppContext } from "@/app/app-provider";

interface FormData {
  deliveryDate: string;
  pickupDate: string;
  notes: string;
  deliveryMethod: string;
  deliveryAddress: string;
  recipientPhone: string;
  recipientName: string;
}

export default function CreateAppointmentPage() {
  const { user } = useAppContext();
  console.log(user);
  const [formData, setFormData] = useState<FormData>({
    deliveryDate: "",
    pickupDate: "",
    notes: "",
    deliveryMethod: "",
    deliveryAddress: "",
    recipientPhone: "",
    recipientName: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "deliveryDate") {
      // Reset error when delivery date changes
      setError(null);

      // Disable pickup date if delivery date is not selected
      if (!value) {
        setFormData({ ...formData, pickupDate: "" });
      }
    }

    if (name === "pickupDate") {
      // Validate pickup date based on delivery date
      if (formData.deliveryDate && value) {
        const deliveryDate = new Date(formData.deliveryDate);
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

    if (name === "deliveryMethod") {
      // Clear delivery address if delivery method is "direct"
      if (value === "direct") {
        setFormData({ ...formData, deliveryAddress: "" });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here (e.g., send data to backend)
    console.log(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
        Tạo lịch hẹn mới
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Delivery Date */}
          <div>
            <label
              htmlFor="deliveryDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày giao đồ
            </label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              min={format(new Date(), "yyyy-MM-dd")} // Min date is today
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Pickup Date */}
          <div>
            <label
              htmlFor="pickupDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày nhận đồ
            </label>
            <input
              type="date"
              id="pickupDate"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              min={formData.deliveryDate} // Min date is delivery date
              max={
                formData.deliveryDate
                  ? format(
                      new Date(
                        new Date(formData.deliveryDate).getTime() +
                          3 * 24 * 60 * 60 * 1000
                      ),
                      "yyyy-MM-dd"
                    )
                  : undefined
              } // Max date is delivery date + 3 days
              disabled={!formData.deliveryDate} // Disable if delivery date is not selected
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                !formData.deliveryDate && "bg-gray-200"
              }`}
            />
          </div>
        </div>
        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Ghi chú
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
            placeholder="Nhập ghi chú (nếu có)"
          />
        </div>
        {/* Delivery Method */}
        <div>
          <label
            htmlFor="deliveryMethod"
            className="block text-sm font-medium text-gray-700"
          >
            Phương thức vận chuyển
          </label>
          <div className="mt-1 grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                id="direct"
                name="deliveryMethod"
                value="direct"
                checked={formData.deliveryMethod === "direct"}
                onChange={handleChange}
                className="cursor-pointer focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm">Nhận hàng trực tiếp</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                id="shipping"
                name="deliveryMethod"
                value="shipping"
                checked={formData.deliveryMethod === "shipping"}
                onChange={handleChange}
                className="cursor-pointer focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm">Thông qua đơn vị vận chuyển</span>
            </label>
          </div>
        </div>

        {/* Delivery Address */}
        {formData.deliveryMethod !== "direct" && (
          <div>
            <label
              htmlFor="deliveryAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Địa chỉ nhận
            </label>
            <input
              type="text"
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nhập địa chỉ nhận"
            />
          </div>
        )}
        {/* Recipient Phone */}
        <div>
          <label
            htmlFor="recipientPhone"
            className="block text-sm font-medium text-gray-700"
          >
            Số điện thoại người nhận
          </label>
          <input
            type="text"
            id="recipientPhone"
            name="recipientPhone"
            value={formData.recipientPhone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập số điện thoại người nhận"
          />
        </div>
        {/* Recipient Name */}
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
            value={formData.recipientName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập họ tên người nhận"
          />
        </div>
        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Đặt lịch hẹn
          </button>
        </div>
      </form>
    </div>
  );
}
