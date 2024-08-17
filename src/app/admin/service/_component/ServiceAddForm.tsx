"use client";

import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import serviceApiRequest from "@/app/apiRequest/service";
import Alert from "@/components/Alert";
import { useRouter } from "next/navigation";
import { ServiceCreateBodyType } from "@/app/schemaValidations/service.schema";

const ServiceAddForm = ({ userId }: { userId: number }) => {
  const [formData, setFormData] = useState<ServiceCreateBodyType>({
    serviceName: "",
    description: null,
    price: 0,
    status: 1, // Default status is active
    promotionId: null,
    staffId: userId,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "price") {
      // Remove any non-numeric characters except for comma
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({
        ...formData,
        [name]: parseInt(numericValue, 10) || 0,
      });
    } else if (name === "description") {
      setFormData({
        ...formData,
        [name]: value || null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const { serviceName, price } = formData;
    let formErrors: { [key: string]: string } = {};

    if (!serviceName) {
      formErrors.serviceName = "Tên dịch vụ không được để trống.";
    }
    if (price <= 0) {
      formErrors.price = "Giá dịch vụ phải lớn hơn 0.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const formatCurrency = (value: number) => {
    return value
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace("₫", "")
      .trim();
  };

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await serviceApiRequest.createService(formData);
        Alert.success("Thành công!", response.payload.message);
        router.push("/admin/service");
        router.refresh();
      } catch (error) {
        console.error("Error creating service:", error);
        Alert.error("Lỗi!", "Đã xảy ra lỗi khi tạo dịch vụ.");
      }
    }
  };

  return (
    <div className="bg-blue-50 p-8 rounded-lg shadow-lg max-w-md mx-auto m-t">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        Thêm Dịch Vụ
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên dịch vụ
            </label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
            {errors.serviceName && (
              <span className="text-red-500 text-sm">{errors.serviceName}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={4}
              className="form-textarea block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giá
            </label>
            <input
              type="text"
              name="price"
              value={formatCurrency(formData.price)}
              onChange={handleChange}
              maxLength={8} // Restrict to a maximum of 7 digits
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
            {errors.price && (
              <span className="text-red-500 text-sm">{errors.price}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            >
              <option value={1}>Đang hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105 duration-300"
          >
            <MdAdd size={20} className="inline-block mr-2" />
            Lưu thông tin dịch vụ
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceAddForm;
