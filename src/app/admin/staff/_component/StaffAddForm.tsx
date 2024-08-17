"use client";

import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import staffApiRequest from "@/app/apiRequest/staff";

import Alert from "@/components/Alert";
import { useRouter } from "next/navigation";
import {
  StaffCreateBodyType,
  RegisterAccountBodyType,
  PositionType,
} from "@/app/schemaValidations/staff.schema";

// Định nghĩa danh sách các vị trí (được sử dụng trong schema và select)
const Positions = [
  "Nhân viên Tiếp nhận",
  "Nhân viên Giặt",
  "Nhân viên Là ủi",
  "Nhân viên Giao nhận",
  "Quản lý Cửa hàng",
  "Nhân viên Kế toán",
] as const;

const StaffAddForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
    position: "" as PositionType, // Đặt kiểu chính xác ở đây
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value as any, // Chuyển đổi giá trị thành kiểu bất kỳ
    }));
  };

  const validateForm = () => {
    const { userName, password, name, email, phoneNumber, position } = formData;
    let formErrors: { [key: string]: string } = {};

    if (!userName) formErrors.userName = "Tên người dùng không được để trống.";
    if (!password || password.length < 6)
      formErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    if (!name) formErrors.name = "Tên không được để trống.";
    if (!email) formErrors.email = "Email không được để trống.";
    if (!phoneNumber)
      formErrors.phoneNumber = "Số điện thoại không được để trống.";
    if (!position || !Positions.includes(position as PositionType))
      formErrors.position = "Vị trí không hợp lệ.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const accountData: RegisterAccountBodyType = {
          username: formData.userName,
          password: formData.password,
          role: 2, // Default role for staff
          active: true,
        };

        const response = await staffApiRequest.registerAccount(accountData);

        const staffData: StaffCreateBodyType = {
          username: formData.userName,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          position: formData.position, // Giá trị kiểu PositionType
          status: 1, // Default status is active
          avatar: null, // Default avatar is null
        };

        const result = await staffApiRequest.createStaff(staffData);

        Alert.success("Thành công!", result.payload.message);
        router.push("/admin/staff");
        router.refresh();
      } catch (error) {
        console.error("Error creating staff:", error);
        Alert.error("Lỗi!", "Đã xảy ra lỗi khi tạo nhân viên.");
      }
    }
  };

  return (
    <div className="bg-blue-50 p-8 rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        Thêm Nhân Viên
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên người dùng
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
            {errors.userName && (
              <span className="text-red-500 text-sm">{errors.userName}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vị trí
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            >
              <option value="">Chọn vị trí</option>
              {Positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
            {errors.position && (
              <span className="text-red-500 text-sm">{errors.position}</span>
            )}
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105 duration-300"
          >
            <MdAdd size={20} className="inline-block mr-2" />
            Lưu thông tin nhân viên
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffAddForm;
