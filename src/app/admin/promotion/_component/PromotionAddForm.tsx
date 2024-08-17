"use client";

import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import { CreatePromotionBodyType } from "@/app/schemaValidations/promotion.schema";

import promotionApiRequest from "@/app/apiRequest/promotion";
import Alert from "@/components/Alert";
import { useRouter } from "next/navigation";

const PromotionAddForm = ({ userId }: { userId: number }) => {
  const [formData, setFormData] = useState<CreatePromotionBodyType>({
    promotionName: "",
    startDate: "",
    endDate: "",
    discountRate: 0,
    status: 0,
    staffId: userId,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validateDates = () => {
    const { startDate, endDate } = formData;
    if (startDate && endDate) {
      return new Date(startDate) <= new Date(endDate);
    }
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "discountRate" ? Number(value) / 100 : value,
    });

    if (name === "startDate" || name === "endDate") {
      if (!validateDates()) {
        setErrors({
          ...errors,
          endDate: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.",
        });
      } else {
        setErrors({ ...errors, endDate: "" });
      }
    }
  };

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { promotionName, startDate, endDate, discountRate } = formData;
    let formErrors: { [key: string]: string } = {};

    // Validate required fields
    if (!promotionName) {
      formErrors.promotionName = "Tên khuyến mãi không được để trống.";
    }
    if (!startDate) {
      formErrors.startDate = "Ngày bắt đầu không được để trống.";
    }
    if (!endDate) {
      formErrors.endDate = "Ngày kết thúc không được để trống.";
    }
    if (discountRate <= 0 || discountRate > 1) {
      formErrors.discountRate = "Mức giảm giá phải từ 1 đến 100.";
    }
    if (!validateDates()) {
      formErrors.endDate = "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.";
    }

    setErrors(formErrors);
    let response;
    if (Object.keys(formErrors).length === 0) {
      try {
        response = await promotionApiRequest.createPromotion(formData);
        Alert.success("Thành công!", response.payload.message);
        router.push("/admin/promotion");
        router.refresh();
      } catch (error) {
        console.error("Error creating promotion:", error);
        Alert.error("Lỗi!", response?.payload.message || "Đã xảy ra lỗi");
      }
    }
  };

  return (
    <div className="bg-blue-50 p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Thêm Khuyến Mãi</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên khuyến mãi
            </label>
            <input
              type="text"
              name="promotionName"
              value={formData.promotionName}
              onChange={handleChange}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
            {errors.promotionName && (
              <span className="text-red-500 text-sm">
                {errors.promotionName}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={getCurrentDate()}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
            {errors.startDate && (
              <span className="text-red-500 text-sm">{errors.startDate}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={getCurrentDate()}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              disabled={!formData.startDate}
            />
            {errors.endDate && (
              <span className="text-red-500 text-sm">{errors.endDate}</span>
            )}
            {!validateDates() && (
              <div className="text-red-500 text-sm">
                Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mức giảm giá (%)
            </label>
            <select
              name="discountRate"
              value={formData.discountRate * 100}
              onChange={handleChange}
              className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            >
              {Array.from({ length: 100 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}%
                </option>
              ))}
            </select>
            {errors.discountRate && (
              <span className="text-red-500 text-sm">
                {errors.discountRate}
              </span>
            )}
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-300"
            disabled={!validateDates()}
          >
            <MdAdd size={20} className="inline-block mr-2" />
            Lưu thông tin khuyến mãi
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionAddForm;
