"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdAdd, MdEdit } from "react-icons/md";
import { PromotionsResType } from "@/app/schemaValidations/promotion.schema";
import { ServicesResType } from "@/app/schemaValidations/service.schema";
import { ServiceUpdateBody } from "@/app/schemaValidations/service.schema";
import serviceApiRequest from "@/app/apiRequest/service";
import Alert from "@/components/Alert";

// Function to format price in VND
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Function to get the discounted price
const getDiscountedPrice = (price: number, discountRate: number) => {
  return price * (1 - discountRate / 100);
};

// Function to get the status number from status string
const statusToNumber = (status: string): number => {
  return status === "Đang hoạt động" ? 1 : 0;
};

const ServiceManagementForm = ({
  services,
  promotions,
  userId,
}: {
  services: ServicesResType["data"] | null;
  promotions: PromotionsResType["data"] | null;
  userId: number;
}) => {
  const router = useRouter();
  const itemsPerPage = 4; // Number of services per page
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [localServices, setLocalServices] = useState(services);

  if (!services) {
    return <div>Không có dữ liệu dịch vụ</div>;
  }

  // Calculate total pages
  const totalPages = Math.ceil(services.length / itemsPerPage);

  // Get services for current page
  const currentServices = localServices?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (serviceId: number) => {
    setEditingServiceId(serviceId);
  };

  const handleChange = (
    serviceId: number,
    field: keyof ServiceUpdateBody,
    value: any
  ) => {
    setLocalServices(
      (prevServices) =>
        prevServices?.map((service) =>
          service.serviceId === serviceId
            ? { ...service, [field]: value }
            : service
        ) || []
    );
  };

  const handleSave = async (serviceId: number) => {
    const updatedService = localServices?.find(
      (service) => service.serviceId === serviceId
    );
    if (updatedService) {
      // Update the service using your API
      const result = await serviceApiRequest.updateService(
        updatedService,
        serviceId
      );
      Alert.success("Thành công!", result.payload.message);
      setEditingServiceId(null);
      router.push("/admin/service");
      router.refresh(); // Refresh the page or fetch updated data
    }
  };

  const handleCancel = () => {
    setEditingServiceId(null);
    setLocalServices(services); // Reset local services to the original data
  };

  // Function to get promotion by promotionId
  const getPromotion = (promotionId: number | null) => {
    if (!promotions) return null;
    return promotions.find((promo) => promo.promotionId === promotionId);
  };

  return (
    <div className="container mx-auto p-6 bg-blue-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div />
        <button
          className="flex items-center p-2 text-sm rounded bg-green-400 text-green-900 shadow-lg transition-transform transform hover:scale-105"
          onClick={() => router.push("/admin/service/add")}
        >
          <MdAdd className="mr-1" />
          Thêm dịch vụ
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-blue-300 shadow-lg rounded-lg text-sm">
          <thead className="bg-blue-200 text-blue-800">
            <tr>
              <th className="px-6 py-3 border-b border-blue-300">Mã dịch vụ</th>
              <th className="px-6 py-3 border-b border-blue-300">
                Tên dịch vụ
              </th>
              <th className="px-6 py-3 border-b border-blue-300">Mô tả</th>
              <th className="px-6 py-3 border-b border-blue-300">Giá gốc</th>
              <th className="px-6 py-3 border-b border-blue-300">
                Giá sau khuyến mãi
              </th>
              <th className="px-6 py-3 border-b border-blue-300">Trạng thái</th>
              <th className="px-6 py-3 border-b border-blue-300">
                Khuyến mãi áp dụng
              </th>
              <th className="px-6 py-3 border-b border-blue-300">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {currentServices && currentServices.length > 0 ? (
              currentServices.map((service) => {
                const promotion = getPromotion(service.promotionId);
                const discountRate = promotion ? promotion.discountRate : 0;
                const discountedPrice = getDiscountedPrice(
                  service.price,
                  discountRate
                );

                return (
                  <tr
                    key={service.serviceId}
                    className="hover:bg-blue-100 transition-colors duration-300"
                  >
                    <td className="px-6 py-3 border-b border-blue-300">
                      {service.serviceId}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300">
                      {editingServiceId === service.serviceId ? (
                        <input
                          type="text"
                          value={service.serviceName}
                          onChange={(e) =>
                            handleChange(
                              service.serviceId,
                              "serviceName",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border border-blue-300 rounded"
                        />
                      ) : (
                        service.serviceName
                      )}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300">
                      {editingServiceId === service.serviceId ? (
                        <textarea
                          value={service.description}
                          onChange={(e) =>
                            handleChange(
                              service.serviceId,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border border-blue-300 rounded"
                        />
                      ) : (
                        service.description
                      )}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300">
                      {editingServiceId === service.serviceId ? (
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) =>
                            handleChange(
                              service.serviceId,
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full p-1 border border-blue-300 rounded"
                        />
                      ) : (
                        formatPrice(service.price)
                      )}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300">
                      {formatPrice(discountedPrice)}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300">
                      {editingServiceId === service.serviceId ? (
                        <select
                          value={
                            service.status === 1
                              ? "Đang hoạt động"
                              : "Ngừng hoạt động"
                          }
                          onChange={(e) =>
                            handleChange(
                              service.serviceId,
                              "status",
                              e.target.value === "Đang hoạt động" ? 1 : 0
                            )
                          }
                          className="w-full p-1 border border-blue-300 rounded"
                        >
                          <option value="Đang hoạt động">Đang hoạt động</option>
                          <option value="Ngừng hoạt động">
                            Ngừng hoạt động
                          </option>
                        </select>
                      ) : service.status === 1 ? (
                        "Đang hoạt động"
                      ) : (
                        "Ngừng hoạt động"
                      )}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300">
                      {promotion ? promotion.promotionName : "Không"}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300 flex space-x-2">
                      {editingServiceId === service.serviceId ? (
                        <>
                          <button
                            onClick={() => handleSave(service.serviceId)}
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
                          onClick={() => handleEdit(service.serviceId)}
                          className="p-2 text-sm rounded bg-yellow-400 text-yellow-900 shadow-lg"
                        >
                          <MdEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-3">
                  Không có dịch vụ
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

export default ServiceManagementForm;
