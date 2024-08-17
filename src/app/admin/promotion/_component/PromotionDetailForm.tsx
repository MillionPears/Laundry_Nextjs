"use client";

import { useState } from "react";
import { ServicesResType } from "@/app/schemaValidations/service.schema";
import serviceApiRequest from "@/app/apiRequest/service";
import Alert from "@/components/Alert";
import promotionApiRequest from "@/app/apiRequest/promotion";
import { useRouter } from "next/navigation";
import { FiSave } from "react-icons/fi";

const PromotionDetailForm = ({
  services,
  params,
}: {
  services: ServicesResType["data"] | null;
  params: { id: number };
}) => {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckboxChange = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const categorizeServices = (services: ServicesResType["data"]) => {
    const noPromotion: ServicesResType["data"] = [];
    const hasPromotion: ServicesResType["data"] = [];

    services.forEach((service) => {
      if (service.promotionId === null) {
        noPromotion.push(service);
      } else {
        hasPromotion.push(service);
      }
    });

    return { noPromotion, hasPromotion };
  };

  const { noPromotion, hasPromotion } = services
    ? categorizeServices(services)
    : {
        noPromotion: [],
        hasPromotion: [],
      };

  const savePromotions = async () => {
    if (selectedServices.length === 0) {
      setError("Vui lòng chọn ít nhất một dịch vụ.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await serviceApiRequest.updatePromotionForServices(
        params.id,
        {
          serviceIds: selectedServices,
        }
      );

      Alert.success("Thành công!", result.payload.message);
      await promotionApiRequest.updateStatusActive(1, params.id);
      setSelectedServices([]); // Xóa các dịch vụ đã chọn
      router.push("/admin/promotion");
      router.refresh();
    } catch (error) {
      setError("Đã xảy ra lỗi khi lưu dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" container mx-auto p-6 bg-blue-50  h-screen">
      <div className="min-w-full overflow-x-auto h-5/6">
        <table className="min-w-full bg-white border border-blue-300 shadow-lg rounded-lg text-sm">
          <thead className="bg-blue-200 text-blue-800">
            <tr>
              <th className="px-6 py-3 border-b border-blue-300 sticky top-0 bg-blue-200">
                Tên dịch vụ
              </th>
              <th className="px-6 py-3 border-b border-blue-300 sticky top-0 bg-blue-200">
                Mô tả dịch vụ
              </th>
              <th className="px-6 py-3 border-b border-blue-300 sticky top-0 bg-blue-200">
                Chọn
              </th>
            </tr>
          </thead>
          <tbody>
            {noPromotion.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={3}
                    className="font-bold text-blue-600 py-2 bg-blue-100 text-center"
                  >
                    Những dịch vụ chưa áp dụng khuyến mãi nào
                  </td>
                </tr>
                {noPromotion.map((service) => (
                  <tr
                    key={service.serviceId}
                    className="hover:bg-blue-100 transition-colors duration-300"
                  >
                    <td className="px-6 py-3 border-b border-blue-300">
                      {service.serviceName}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300">
                      {service.description}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300 text-center">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.serviceId)}
                        onChange={() => handleCheckboxChange(service.serviceId)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                  </tr>
                ))}
              </>
            )}

            {hasPromotion.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={3}
                    className="font-bold text-blue-600 py-2 bg-blue-100 text-center"
                  >
                    Những dịch vụ đã có khuyến mãi
                  </td>
                </tr>
                {hasPromotion.map((service) => (
                  <tr
                    key={service.serviceId}
                    className="hover:bg-blue-100 transition-colors duration-300"
                  >
                    <td className="px-6 py-3 border-b border-blue-300">
                      {service.serviceName}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300">
                      {service.description}
                    </td>
                    <td className="px-6 py-3 border-b border-blue-300 text-center">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.serviceId)}
                        onChange={() => handleCheckboxChange(service.serviceId)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                  </tr>
                ))}
              </>
            )}

            {!noPromotion.length && !hasPromotion.length && (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Không có dịch vụ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-center">
        <button
          onClick={savePromotions}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu Khuyến Mãi"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default PromotionDetailForm;
