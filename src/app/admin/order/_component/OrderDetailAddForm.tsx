"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { ServicesResType } from "@/app/schemaValidations/service.schema";
import { MdDelete } from "react-icons/md";
import orderApiRequest from "@/app/apiRequest/order";
import Alert from "@/components/Alert";
import { useRouter } from "next/navigation";

const OrderDetailAddForm = ({
  services,
  orderId,
}: {
  services: ServicesResType["data"] | null;
  orderId: number;
}) => {
  const { control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: {
      details: [] as { serviceId: number; amount: number; price: number }[],
    },
  });

  const router = useRouter();
  const [serviceOptions, setServiceOptions] = useState<
    { id: number; name: string; price: number }[]
  >([]);
  const [selectedServices, setSelectedServices] = useState<Set<number>>(
    new Set()
  );
  const [hasService, setHasService] = useState<boolean>(false);

  useEffect(() => {
    if (services) {
      setServiceOptions(
        services.map((service) => ({
          id: service.serviceId,
          name: service.serviceName,
          price: service.price,
        }))
      );
    }
  }, [services]);

  const details = watch("details");

  useEffect(() => {
    const selectedIds = new Set(
      details.map((detail: { serviceId: number }) => detail.serviceId)
    );
    setSelectedServices(selectedIds);

    // Check if there is at least one service in details
    const hasAnyService = details.some(
      (detail: { serviceId: number }) => detail.serviceId > 0
    );
    setHasService(hasAnyService);
  }, [details]);

  const handleAddRow = () => {
    const currentDetails = getValues("details");
    setValue("details", [
      ...currentDetails,
      { serviceId: 0, amount: 1, price: 0 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const currentDetails = getValues("details");
    const removedServiceId = currentDetails[index].serviceId;
    const updatedDetails = currentDetails.filter((_, idx) => idx !== index);
    setValue("details", updatedDetails);

    // Update selected services
    setSelectedServices((prev) => {
      const updated = new Set(prev);
      updated.delete(removedServiceId);
      return updated;
    });
  };

  const onSubmit = async (data: Record<string, any>) => {
    try {
      // Transform data.details to match the expected schema
      const formattedDetails = data.details.map(
        (detail: { serviceId: number; amount: number; price: number }) => ({
          id: {
            orderId: orderId, // Use the orderId passed as a prop
            serviceId: detail.serviceId,
          },
          amount: detail.amount,
          price: detail.price,
        })
      );

      // Make the API request with the formatted data
      const result = await orderApiRequest.createOrderDetail(formattedDetails);

      Alert.success("Thành công!", result.payload.message);
      router.push("/admin/order");
      router.refresh();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      alert("Có lỗi xảy ra khi thêm chi tiết đơn hàng");
    }
  };

  const updatePrice = (index: number, serviceId: number) => {
    const selectedService = serviceOptions.find(
      (service) => service.id === serviceId
    );
    if (selectedService) {
      const currentDetails = getValues("details");
      currentDetails[index].price = selectedService.price;
      setValue("details", [...currentDetails]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
        <thead className="bg-blue-200">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/3">
              Tên dịch vụ
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/6">
              Số lượng
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/6">
              Đơn giá
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/6">
              Thành tiền
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/6">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {details.map(
            (
              item: { serviceId: number; amount: number; price: number },
              index: number
            ) => (
              <tr key={index}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Controller
                    name={`details.${index}.serviceId`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value}
                        className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        onChange={(e) => {
                          const selectedServiceId = Number(e.target.value);
                          field.onChange(selectedServiceId);
                          updatePrice(index, selectedServiceId);
                        }}
                      >
                        <option value={0}>Chọn dịch vụ</option>
                        {serviceOptions
                          .filter(
                            (service) =>
                              !selectedServices.has(service.id) ||
                              service.id === item.serviceId
                          )
                          .map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name}
                            </option>
                          ))}
                      </select>
                    )}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center">
                  <Controller
                    name={`details.${index}.amount`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="1"
                        className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right">
                  {item.price.toLocaleString()} VND
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right">
                  {(item.amount * item.price).toLocaleString()} VND
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="text-red-500 hover:text-red-700 transition-transform duration-300 transform hover:scale-110"
                  >
                    <MdDelete size={24} />
                  </button>
                </td>
              </tr>
            )
          )}
          <tr>
            <td colSpan={5} className="text-center py-4">
              <button
                type="button"
                onClick={handleAddRow}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300"
              >
                Thêm chi tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="text-center">
        <button
          type="submit"
          className={`bg-blue-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300 ${
            !hasService ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!hasService}
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default OrderDetailAddForm;
