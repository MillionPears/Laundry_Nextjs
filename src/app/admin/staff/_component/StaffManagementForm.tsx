"use client";

import React, { useState } from "react";
import {
  StaffCreateBodyType,
  StaffsResType,
} from "@/app/schemaValidations/staff.schema";
import { MdAdd, MdEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import staffApiRequest from "@/app/apiRequest/staff";
import Alert from "@/components/Alert";

const Positions = [
  "Nhân viên Tiếp nhận",
  "Nhân viên Giặt",
  "Nhân viên Là ủi",
  "Nhân viên Giao nhận",
  "Quản lý Cửa hàng",
  "Nhân viên Kế toán",
] as const;

type PositionType = (typeof Positions)[number];

const StaffManagementForm = ({
  staffs,
}: {
  staffs: StaffsResType["data"] | null;
}) => {
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [currentStaffData, setCurrentStaffData] = useState(staffs || []);
  const [currentPage, setCurrentPage] = useState(1);
  const staffsPerPage = 5;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const sortedStaffData = currentStaffData.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });
  const totalPages = Math.ceil(sortedStaffData.length / staffsPerPage);
  const currentStaffs = sortedStaffData.slice(
    (currentPage - 1) * staffsPerPage,
    currentPage * staffsPerPage
  );

  const router = useRouter();

  const handleChange = (
    id: number,
    field: keyof StaffsResType["data"][0],
    value: string | number
  ) => {
    setCurrentStaffData((prevData) =>
      prevData.map((staff) =>
        staff.id === id ? { ...staff, [field]: value } : staff
      )
    );
  };

  const handleEdit = (id: number) => {
    setEditingStaffId(id);
  };

  const handleSave = async (staffId: number) => {
    const staffToUpdate = currentStaffData.find(
      (staff) => staff.id === staffId
    );

    if (staffToUpdate) {
      // Đảm bảo rằng giá trị position là hợp lệ
      const validPositions: PositionType[] = [
        "Nhân viên Tiếp nhận",
        "Nhân viên Giặt",
        "Nhân viên Là ủi",
        "Nhân viên Giao nhận",
        "Quản lý Cửa hàng",
        "Nhân viên Kế toán",
      ];
      const position = validPositions.includes(
        staffToUpdate.position as PositionType
      )
        ? (staffToUpdate.position as PositionType)
        : "Nhân viên Tiếp nhận"; // Hoặc một giá trị mặc định hợp lệ khác

      // Tạo đối tượng body để gửi đến API
      const updateBody: StaffCreateBodyType = {
        name: staffToUpdate.name,
        position,
        email: staffToUpdate.email,
        phoneNumber: staffToUpdate.phoneNumber,
        avatar: staffToUpdate.avatar || null,
        username: staffToUpdate.username,
        status: staffToUpdate.status,
      };

      try {
        const result = await staffApiRequest.updateById(updateBody, staffId);
        Alert.success("Thành công!", result.payload.message);
        router.push("/admin/staff");
        router.refresh();
        // Xử lý kết quả từ API
      } catch (error) {
        console.error("Lỗi khi cập nhật nhân viên:", error);
        Alert.error("Lỗi!");
      }
    }

    setEditingStaffId(null);
  };

  const handleCancel = () => {
    setEditingStaffId(null);
  };

  const handleAddStaff = () => {
    router.push("/admin/staff/add");
  };

  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="flex justify-between items-center mb-4 ">
        <button
          className=" ml-auto flex items-center p-2 text-sm rounded bg-green-400 text-green-900 shadow-lg transition-transform transform hover:scale-105"
          onClick={handleAddStaff}
        >
          <MdAdd className="mr-1" />
          Thêm nhân viên
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-blue-300 shadow-lg rounded-lg text-sm">
          <thead className="bg-blue-200 text-blue-800">
            <tr>
              <th className="px-6 py-3 border-b border-blue-300">
                Mã Nhân viên
              </th>
              <th className="px-6 py-3 border-b border-blue-300">
                Họ Tên nhân viên
              </th>
              <th className="px-6 py-3 border-b border-blue-300">
                Vị trí làm việc
              </th>
              <th className="px-6 py-3 border-b border-blue-300">Email</th>
              <th className="px-6 py-3 border-b border-blue-300">
                Số điện thoại liên hệ
              </th>
              <th className="px-6 py-3 border-b border-blue-300">
                Trạng thái hoạt động
              </th>
              <th className="px-6 py-3 border-b border-blue-300">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {currentStaffs && currentStaffs.length > 0 ? (
              currentStaffs.map((staff) => (
                <tr
                  key={staff.id}
                  className="hover:bg-blue-100 transition-colors duration-300"
                >
                  <td className="px-6 py-3 border-b border-blue-300">
                    {staff.id}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {staff.name}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {editingStaffId === staff.id ? (
                      <select
                        value={staff.position}
                        onChange={(e) =>
                          handleChange(
                            staff.id,
                            "position",
                            e.target.value as PositionType
                          )
                        }
                        className="w-full p-1 border border-blue-300 rounded"
                      >
                        {Positions.map((position) => (
                          <option key={position} value={position}>
                            {position}
                          </option>
                        ))}
                      </select>
                    ) : (
                      staff.position
                    )}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {staff.email}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {staff.phoneNumber}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300">
                    {editingStaffId === staff.id ? (
                      <select
                        value={
                          staff.status === 1 ? "Đang làm việc" : "Nghỉ việc"
                        }
                        onChange={(e) =>
                          handleChange(
                            staff.id,
                            "status",
                            e.target.value === "Đang làm việc" ? 1 : 0
                          )
                        }
                        className="w-full p-1 border border-blue-300 rounded"
                      >
                        <option value="Đang làm việc">Đang làm việc</option>
                        <option value="Nghỉ việc">Nghỉ việc</option>
                      </select>
                    ) : staff.status === 1 ? (
                      "Đang làm việc"
                    ) : (
                      "Nghỉ việc"
                    )}
                  </td>
                  <td className="px-6 py-3 border-b border-blue-300 flex space-x-2">
                    {editingStaffId === staff.id ? (
                      <>
                        <button
                          onClick={() => handleSave(staff.id)}
                          className="p-2 text-sm rounded bg-blue-400 text-blue-900 shadow-lg"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 text-sm rounded bg-gray-400 text-white shadow-lg"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(staff.id)}
                        className="p-2 text-sm rounded bg-yellow-400 text-yellow-900 shadow-lg"
                      >
                        <MdEdit />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-3">
                  Không có nhân viên
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
        >
          &lt; Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() =>
            setCurrentPage((page) => Math.min(page + 1, totalPages))
          }
        >
          Tiếp &gt;
        </button>
      </div>
    </div>
  );
};

export default StaffManagementForm;
