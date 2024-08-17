"use client";

import { useState } from "react";
import {
  MdEdit,
  MdDelete,
  MdInfo,
  MdAdd,
  MdDetails,
  MdCancel,
  MdSave,
} from "react-icons/md";
import { PromotionsResType } from "@/app/schemaValidations/promotion.schema";
import { useRouter } from "next/navigation";
import promotionApiRequest from "@/app/apiRequest/promotion";
import Alert from "@/components/Alert";

// Định nghĩa kiểu cho các thuộc tính có thể sắp xếp
type PromotionColumn =
  | "promotionId"
  | "promotionName"
  | "discountRate"
  | "startDate"
  | "endDate"
  | "status";

const PromotionManagementForm = ({
  promotions,
}: {
  promotions: PromotionsResType["data"] | null;
}) => {
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<number | "">("");
  const [sortColumn, setSortColumn] = useState<PromotionColumn>("discountRate"); // Cột sắp xếp
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Hướng sắp xếp
  const [editingId, setEditingId] = useState<number | null>(null); // ID của mục đang chỉnh sửa
  const [editedPromotions, setEditedPromotions] = useState<
    PromotionsResType["data"] | null
  >(promotions); // Trạng thái để lưu dữ liệu đã chỉnh sửa

  // Bộ lọc dữ liệu dựa trên các lựa chọn lọc
  const filteredPromotions = promotions?.filter((promotion) => {
    const startDateMatch = startDateFilter
      ? new Date(promotion.startDate) >= new Date(startDateFilter)
      : true;
    const statusMatch =
      statusFilter !== "" ? promotion.status === statusFilter : true;
    return startDateMatch && statusMatch;
  });

  // Chuyển đổi mức khuyến mãi từ kiểu double sang phần trăm
  const formatDiscountRate = (rate: number) => {
    return (rate * 100).toFixed(0) + "%"; // Chuyển đổi và định dạng phần trăm
  };

  // Hàm sắp xếp
  const sortedPromotions = filteredPromotions?.sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    const direction = sortDirection === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction * aValue.localeCompare(bValue);
    }
    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });

  // Hàm xử lý nhấp chuột vào tiêu đề cột
  const handleSort = (column: PromotionColumn) => {
    if (column === sortColumn) {
      // Nếu cột đã được sắp xếp, thay đổi hướng sắp xếp
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Nếu cột khác, sắp xếp theo cột mới và mặc định hướng là "asc"
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const router = useRouter();
  const handleEdit = (promotionId: number) => {
    setEditingId(promotionId); // Thiết lập ID của mục đang chỉnh sửa
  };

  const handleDelete = (promotionId: number) => {
    // Xử lý khi nhấp vào nút xóa
    // Ví dụ: Gửi yêu cầu API để xóa khuyến mãi
  };

  const handleInfo = (promotionId: number) => {
    router.push(`/admin/promotion/${promotionId}`);
  };

  const handleDetail = (promotionId: number) => {
    router.push(`/admin/promotion/${promotionId}/detail`);
  };

  const handleAddPromotion = () => {
    router.push("/admin/promotion/add");
    router.refresh();
  };

  const handleSave = async (promotionId: number) => {
    const editedPromotion = editedPromotions?.find(
      (p) => p.promotionId === promotionId
    );
    if (!editedPromotion) return;

    const { promotionName, discountRate, startDate, endDate } = editedPromotion;

    // Kiểm tra không để trống các cột chỉnh sửa
    if (
      !promotionName ||
      !startDate ||
      !endDate ||
      discountRate === undefined
    ) {
      alert("Vui lòng không để trống các trường chỉnh sửa.");
      return;
    }

    // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
    if (new Date(endDate) <= new Date(startDate)) {
      alert("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    // Kiểm tra mức giảm giá trong khoảng từ 1% đến 100%
    if (discountRate <= 0 || discountRate > 1) {
      alert("Mức giảm giá phải nằm trong khoảng từ 1% đến 100%.");
      return;
    }
    setEditingId(null);

    if (editedPromotion) {
      const {
        promotionName,
        discountRate,
        startDate,
        endDate,
        status,
        staffId,
      } = editedPromotion;
      const result = await promotionApiRequest.updatePromotion(promotionId, {
        promotionName,
        discountRate,
        startDate,
        endDate,
        status,
        staffId,
      });
      Alert.success("Thành công", result.payload.message);
      router.push("/admin/promotion");
      router.refresh();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedPromotions(promotions); // Hoàn tác thay đổi
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(
    (filteredPromotions?.length || 0) / itemsPerPage
  );

  const currentPromotions = sortedPromotions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          {/* Bộ lọc ngày bắt đầu */}
          <div>
            <label className="block text-sm font-medium text-blue-700">
              Ngày bắt đầu từ
            </label>
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Bộ lọc trạng thái */}
          <div>
            <label className="block text-sm font-medium text-blue-700">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Tất cả</option>
              <option value={1}>Đang hoạt động</option>
              <option value={0}>Không còn hoạt động</option>
              <option value={2}>Vừa tạo</option>
            </select>
          </div>
        </div>
        <button
          className="flex items-center p-2 text-sm rounded bg-green-400 text-green-900 shadow-lg transition-transform transform hover:scale-105"
          onClick={handleAddPromotion}
        >
          <MdAdd className="mr-1" />
          Thêm khuyến mãi
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-blue-300 shadow-lg rounded-lg text-sm">
          <thead className="bg-blue-200 text-blue-800">
            <tr>
              <th
                className="px-6 py-3 border-b border-blue-300 cursor-pointer"
                onClick={() => handleSort("promotionId")}
              >
                Mã khuyến mãi{" "}
                {sortColumn === "promotionId" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-6 py-3 border-b border-blue-300 cursor-pointer"
                onClick={() => handleSort("promotionName")}
              >
                Tên khuyến mãi{" "}
                {sortColumn === "promotionName" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-6 py-3 border-b border-blue-300 cursor-pointer"
                onClick={() => handleSort("discountRate")}
              >
                Mức khuyến mãi (%){" "}
                {sortColumn === "discountRate" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-6 py-3 border-b border-blue-300 cursor-pointer"
                onClick={() => handleSort("startDate")}
              >
                Ngày áp dụng{" "}
                {sortColumn === "startDate" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-6 py-3 border-b border-blue-300 cursor-pointer"
                onClick={() => handleSort("endDate")}
              >
                Ngày kết thúc{" "}
                {sortColumn === "endDate" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-6 py-3 border-b border-blue-300 cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Trạng thái{" "}
                {sortColumn === "status" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-6 py-3 border-b border-blue-300">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedPromotions && sortedPromotions.length > 0 ? (
              currentPromotions?.map((promotion) => (
                <tr
                  key={promotion.promotionId}
                  className="hover:bg-blue-100 transition-colors duration-300"
                >
                  <td className="px-6 py-3 border-b border-blue-300">
                    {editingId === promotion.promotionId ? (
                      <input
                        type="text"
                        value={
                          editedPromotions?.find(
                            (p) => p.promotionId === promotion.promotionId
                          )?.promotionId
                        }
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        readOnly
                      />
                    ) : (
                      promotion.promotionId
                    )}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {editingId === promotion.promotionId ? (
                      <input
                        type="text"
                        value={
                          editedPromotions?.find(
                            (p) => p.promotionId === promotion.promotionId
                          )?.promotionName
                        }
                        onChange={(e) =>
                          setEditedPromotions(
                            (prev) =>
                              prev?.map((p) =>
                                p.promotionId === promotion.promotionId
                                  ? { ...p, promotionName: e.target.value }
                                  : p
                              ) ?? []
                          )
                        }
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    ) : (
                      promotion.promotionName
                    )}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {editingId === promotion.promotionId ? (
                      <input
                        type="number"
                        step="0.01"
                        value={
                          editedPromotions?.find(
                            (p) => p.promotionId === promotion.promotionId
                          )?.discountRate
                        }
                        onChange={(e) =>
                          setEditedPromotions(
                            (prev) =>
                              prev?.map((p) =>
                                p.promotionId === promotion.promotionId
                                  ? {
                                      ...p,
                                      discountRate: parseFloat(e.target.value),
                                    }
                                  : p
                              ) ?? []
                          )
                        }
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    ) : (
                      formatDiscountRate(promotion.discountRate)
                    )}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {editingId === promotion.promotionId ? (
                      <input
                        type="date"
                        value={
                          editedPromotions?.find(
                            (p) => p.promotionId === promotion.promotionId
                          )?.startDate
                        }
                        onChange={(e) =>
                          setEditedPromotions(
                            (prev) =>
                              prev?.map((p) =>
                                p.promotionId === promotion.promotionId
                                  ? { ...p, startDate: e.target.value }
                                  : p
                              ) ?? []
                          )
                        }
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    ) : (
                      new Date(promotion.startDate).toLocaleDateString("vi-VN")
                    )}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {editingId === promotion.promotionId ? (
                      <input
                        type="date"
                        value={
                          editedPromotions?.find(
                            (p) => p.promotionId === promotion.promotionId
                          )?.endDate
                        }
                        onChange={(e) =>
                          setEditedPromotions(
                            (prev) =>
                              prev?.map((p) =>
                                p.promotionId === promotion.promotionId
                                  ? { ...p, endDate: e.target.value }
                                  : p
                              ) ?? []
                          )
                        }
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    ) : (
                      new Date(promotion.endDate).toLocaleDateString("vi-VN")
                    )}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {editingId === promotion.promotionId ? (
                      <select
                        value={
                          editedPromotions?.find(
                            (p) => p.promotionId === promotion.promotionId
                          )?.status
                        }
                        onChange={(e) =>
                          setEditedPromotions(
                            (prev) =>
                              prev?.map((p) =>
                                p.promotionId === promotion.promotionId
                                  ? { ...p, status: Number(e.target.value) }
                                  : p
                              ) ?? []
                          )
                        }
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value={1}>Đang hoạt động</option>
                        <option value={0}>Không còn hoạt động</option>
                      </select>
                    ) : promotion.status === 1 ? (
                      "Đang hoạt động"
                    ) : promotion.status === 0 ? (
                      "Không còn hoạt động"
                    ) : (
                      "Vừa tạo"
                    )}
                  </td>

                  <td className="px-6 py-3 border-b border-blue-300 flex space-x-2">
                    {editingId === promotion.promotionId ? (
                      <>
                        <button
                          className="p-2 text-sm rounded bg-blue-400 text-blue-900 shadow-lg transition-transform transform hover:scale-105"
                          onClick={() => handleSave(promotion.promotionId)}
                        >
                          <MdSave />
                        </button>
                        <button
                          className="p-2 text-sm rounded bg-red-400 text-red-900 shadow-lg transition-transform transform hover:scale-105"
                          onClick={handleCancel}
                        >
                          <MdCancel />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="p-2 text-sm rounded bg-blue-400 text-blue-900 shadow-lg transition-transform transform hover:scale-105"
                          onClick={() => handleEdit(promotion.promotionId)}
                        >
                          <MdEdit />
                        </button>

                        <button
                          className="p-2 text-sm rounded bg-teal-400 text-teal-900 shadow-lg transition-transform transform hover:scale-105"
                          onClick={() => handleInfo(promotion.promotionId)}
                        >
                          <MdInfo />
                        </button>
                        <button
                          className="p-2 text-sm rounded bg-purple-400 text-purple-900 shadow-lg transition-transform transform hover:scale-105"
                          onClick={() => handleDetail(promotion.promotionId)}
                        >
                          <MdDetails />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-3 text-gray-500">
                  Không có dữ liệu khuyến mãi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt; Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Tiếp &gt;
        </button>
      </div>
    </div>
  );
};

export default PromotionManagementForm;
