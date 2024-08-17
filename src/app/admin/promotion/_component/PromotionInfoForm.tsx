"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ServicesResType } from "@/app/schemaValidations/service.schema";
import { PromotionResType } from "@/app/schemaValidations/promotion.schema";

const PromotionInfoForm = ({
  services,
  params,
  promotion,
}: {
  services: ServicesResType["data"] | null;
  params: { id: number };
  promotion: PromotionResType["data"] | null;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.push(`/admin/promotion`);
  };

  // Prevent background scrolling when the modal is open
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto"; // Cleanup
    };
  }, [isOpen]);

  if (!services || !promotion) {
    return <p>Không có thông tin dịch vụ hoặc khuyến mãi cho khuyến mãi này</p>;
  }

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-60 z-40"
          onClick={handleClose}
        />
      )}

      {/* Modal Container */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <div className="p-6 bg-white rounded-lg shadow-lg border border-blue-200 w-full max-w-3xl relative">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
              Chi tiết khuyến mãi
            </h2>
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-blue-100">
                <tr>
                  <th
                    colSpan={2}
                    className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider"
                  >
                    Tên khuyến mãi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-blue-700">
                    {promotion.promotionName}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-blue-700">
                    Mức giảm giá: {promotion.discountRate}%
                  </td>
                </tr>
                <tr className="bg-blue-50 font-bold">
                  <td className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Tên dịch vụ đã áp dụng khuyến mãi này
                  </td>
                  {/* <td className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Mô tả dịch vụ
                  </td> */}
                </tr>
                {services.map((service, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                      {service.serviceName}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                      {service.description}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionInfoForm;
