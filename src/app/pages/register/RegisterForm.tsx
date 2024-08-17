"use client";

import React, { useState } from "react";
import { MdAdd } from "react-icons/md";

import Alert from "@/components/Alert";
import { useRouter } from "next/navigation";
import {
  CustomerCreateBodyType,
  RegisterAccountBodyType,
} from "@/app/schemaValidations/customer.schema";
import Image from "next/image"; // Điều chỉnh đường dẫn import nếu cần
import customerApiRequest from "@/app/apiRequest/customer";
import authApiRequest from "@/app/apiRequest/auth";
const getImagePath = (imageName: string) => {
  return `/image/${imageName}.png`;
};
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    hobbie: "",
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
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { userName, password, name, email, phoneNumber, address, hobbie } =
      formData;
    let formErrors: { [key: string]: string } = {};

    if (!userName) formErrors.userName = "Tên người dùng không được để trống.";
    if (!password || password.length < 6)
      formErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    if (!name) formErrors.name = "Tên không được để trống.";
    if (!email) formErrors.email = "Email không được để trống.";
    if (!phoneNumber)
      formErrors.phoneNumber = "Số điện thoại không được để trống.";
    if (!address) formErrors.address = "Địa chỉ không được để trống.";
    if (!hobbie) formErrors.hobbie = "Sở thích không được để trống.";

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
          role: 1,
        };

        const response = await authApiRequest.register(accountData);

        const customerData: CustomerCreateBodyType = {
          name: formData.name,
          address: formData.address,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          hobbie: formData.hobbie,
          avatar: "null", // Default avatar is null
          username: formData.userName,
        };

        const result = await customerApiRequest.createCustomer(customerData);
        // const customer = await customerApiRequest.customerClient(
        //   response.payload.data.username
        // );
        // console.log("cusstomer: ", customer);
        await authApiRequest.auth({
          sessionToken: response.payload.data.token,
          username: response.payload.data.username,
          userId: result.payload.data.id,
        });

        Alert.success("Thành công!", result.payload.message);
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error("Error creating customer:", error);
        Alert.error("Lỗi!", "Đã xảy ra lỗi khi tạo khách hàng.");
      }
    }
  };

  return (
    <div className="flex max-w-6xl mx-auto my-10 p-4 space-x-8">
      {/* Phần Form Đăng Ký */}
      <div className="flex-1 bg-blue-50 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          Đăng ký Khách Hàng
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
                <span className="text-red-500 text-sm">
                  {errors.phoneNumber}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
              {errors.address && (
                <span className="text-red-500 text-sm">{errors.address}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sở thích
              </label>
              <input
                type="text"
                name="hobbie"
                value={formData.hobbie}
                onChange={handleChange}
                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
              {errors.hobbie && (
                <span className="text-red-500 text-sm">{errors.hobbie}</span>
              )}
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105 duration-300"
            >
              <MdAdd size={20} className="inline-block mr-2" />
              Hoàn thành
            </button>
          </div>
        </form>
      </div>

      {/* Phần Hiển Thị Ảnh */}
      <div className="flex-none w-1/2 p-4">
        <Image
          src={getImagePath("signup")}
          alt="Washing Machine"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};

export default RegisterForm;
