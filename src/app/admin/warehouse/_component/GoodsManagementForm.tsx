"use client";

import {
  GoodsesResType,
  GoodsResType,
  GoodsUpdateBodyType,
} from "@/app/schemaValidations/goods.schema";
import { useState, useEffect } from "react";
import { FaMinus, FaPlus, FaExclamationCircle } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import goodsApiRequest from "@/app/apiRequest/goods";
import Alert from "@/components/Alert";
import AlertComponent from "@/components/Alert";
import Swal from "sweetalert2";

const getImagePath = (id: number) => {
  return `/image/goods${id}.jpg`; // Cập nhật đường dẫn dựa trên tên hình ảnh
};

const GoodsManagementForm = ({
  goodses,
}: {
  goodses: GoodsesResType["data"] | null;
}) => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<boolean | null | "lowStock">(
    null
  );
  const [filteredGoods, setFilteredGoods] = useState<
    GoodsesResType["data"] | null
  >(null);

  useEffect(() => {
    if (goodses) {
      let filtered = goodses;
      if (activeFilter === true || activeFilter === false) {
        filtered = goodses.filter((good) => good.active === activeFilter);
      } else if (activeFilter === "lowStock") {
        filtered = goodses.filter((good) => good.amount <= good.threshold);
      }
      setFilteredGoods(filtered);
    }
  }, [activeFilter, goodses]);

  const handleFilterChange = (filter: boolean | null | "lowStock") => {
    setActiveFilter(filter);
    // Reset page to 1 when filter changes (removed for scroll)
  };

  const handleDecreaseQuantity = async (goodsId: number) => {
    const result = await goodsApiRequest.decreaseQuantity(goodsId);
    Alert.success("Thành công", result.payload.message);
    router.refresh();
  };

  const handleAddNew = async () => {
    await Alert.addGoods();
    router.refresh();
  };

  const handleGoToInventory = () => {
    router.push("/admin/warehouse/inventory");
  };

  const handleGoodsClick = async (goodsId: number) => {
    try {
      const response = await goodsApiRequest.getById(goodsId);
      const goods = response.payload.data;

      const goodsDetail = {
        goodsId: goods.goodsId,
        goodsName: goods.goodsName,
        amount: goods.amount,
        active: goods.active,
        threshold: goods.threshold,
        image: "", // Đặt giá trị image là chuỗi rỗng
      };

      AlertComponent.goodsDetails({
        ...goodsDetail,
        onSave: async (updatedGoods) => {
          try {
            const updateResponse = await goodsApiRequest.updateGoods(
              {
                ...updatedGoods,
                amount: goods.amount, // Giữ nguyên giá trị amount hiện tại
                image: "", // Đặt giá trị image là chuỗi rỗng
              },
              goodsId
            );
            Swal.fire("Cập nhật thành công!", "", "success");
            router.refresh();
          } catch (error) {
            console.error("Error updating goods details:", error);
            Swal.fire("Cập nhật thất bại!", "", "error");
          }
        },
      });
    } catch (error) {
      console.error("Error fetching goods details:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="mb-6 flex flex-wrap items-center">
        <button
          onClick={() => handleFilterChange(true)}
          className={`mr-2 mb-2 px-4 py-2 rounded text-sm transition-all duration-300 ${
            activeFilter === true
              ? "bg-blue-400 text-blue-900 shadow-lg transform scale-105"
              : "bg-white text-blue-500 border border-blue-300 hover:bg-blue-100 hover:shadow-md"
          }`}
        >
          Đang hoạt động
        </button>
        <button
          onClick={() => handleFilterChange(false)}
          className={`mr-2 mb-2 px-4 py-2 rounded text-sm transition-all duration-300 ${
            activeFilter === false
              ? "bg-blue-400 text-blue-900 shadow-lg transform scale-105"
              : "bg-white text-blue-500 border border-blue-300 hover:bg-blue-100 hover:shadow-md"
          }`}
        >
          Không hoạt động
        </button>
        <button
          onClick={() => handleFilterChange(null)}
          className={`mr-2 mb-2 px-4 py-2 rounded text-sm transition-all duration-300 ${
            activeFilter === null
              ? "bg-blue-400 text-blue-900 shadow-lg transform scale-105"
              : "bg-white text-blue-500 border border-blue-300 hover:bg-blue-100 hover:shadow-md"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => handleFilterChange("lowStock")}
          className={`mr-2 mb-2 px-4 py-2 rounded text-sm transition-all duration-300 ${
            activeFilter === "lowStock"
              ? "bg-blue-400 text-blue-900 shadow-lg transform scale-105"
              : "bg-white text-blue-500 border border-blue-300 hover:bg-blue-100 hover:shadow-md"
          }`}
        >
          <FaExclamationCircle className="inline-block mr-1" /> Sắp hết hàng
        </button>
        <button
          onClick={handleAddNew}
          className="ml-auto mb-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 hover:shadow-md"
        >
          <FaPlus className="inline-block mr-1" /> Thêm mặt hàng mới
        </button>
        <button
          onClick={handleGoToInventory}
          className="ml-2 mb-2 px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 hover:shadow-md"
        >
          Quản lý nhập hàng
        </button>
      </div>

      {/* Goods cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {filteredGoods?.length ? (
          filteredGoods.map((good) => (
            <div
              key={good.goodsId}
              className={`relative flex flex-col shadow-md rounded-lg overflow-hidden bg-white border border-gray-200 transition-transform transform hover:scale-105 ${
                good.amount <= good.threshold
                  ? "bg-yellow-50 border-yellow-300"
                  : ""
              }`}
              onClick={() => handleGoodsClick(good.goodsId)}
            >
              {/* Icon cảnh báo */}
              {good.amount <= good.threshold && (
                <FaExclamationCircle className="absolute top-2 right-2 text-red-500 text-xl" />
              )}
              <div className="flex-1 p-4 flex flex-col items-center">
                <Image
                  src={getImagePath(good.goodsId)}
                  alt={good.goodsName}
                  width={100}
                  height={100}
                  className="object-cover"
                  priority // Thêm thuộc tính priority
                />

                <h2 className="text-lg font-semibold mt-2">{good.goodsName}</h2>
              </div>
              <div className="p-4">
                <button
                  onClick={() => handleDecreaseQuantity(good.goodsId)}
                  className="w-full flex items-center justify-center gap-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:shadow-md"
                >
                  <FaMinus className="text-xl" />
                  {good.amount}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            Không có mặt hàng nào để hiển thị.
          </p>
        )}
      </div>
    </div>
  );
};

export default GoodsManagementForm;
