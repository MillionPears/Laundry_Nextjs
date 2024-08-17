"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { GoodsesResType } from "@/app/schemaValidations/goods.schema";
import Alert from "@/components/Alert";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import purchaseApiRequest from "@/app/apiRequest/purchase";

const PurchaseAddForm = ({
  goodses,
  employeeId,
}: {
  goodses: GoodsesResType["data"] | null;
  employeeId: number;
}) => {
  const { control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: {
      details: [] as { goodsId: number; amount: number; priceIncome: number }[],
    },
  });
  const router = useRouter();
  const [goodsOptions, setGoodsOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedGoods, setSelectedGoods] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (goodses) {
      setGoodsOptions(
        goodses.map((goods) => ({
          id: goods.goodsId,
          name: goods.goodsName,
        }))
      );
    }
  }, [goodses]);

  const details = watch("details");

  useEffect(() => {
    const selectedIds = new Set(
      details.map((detail: { goodsId: number }) => detail.goodsId)
    );
    setSelectedGoods(selectedIds);
  }, [details]);

  const handleAddRow = () => {
    const currentDetails = getValues("details");
    setValue("details", [
      ...currentDetails,
      { goodsId: 0, amount: 1, priceIncome: 0 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const currentDetails = getValues("details");
    const removedGoodsId = currentDetails[index].goodsId;
    const updatedDetails = currentDetails.filter((_, idx) => idx !== index);
    setValue("details", updatedDetails);

    setSelectedGoods((prev) => {
      const updated = new Set(prev);
      updated.delete(removedGoodsId);
      return updated;
    });
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      const purchaseDetails = data.details.map(
        (detail: { goodsId: number; amount: number; priceIncome: number }) => ({
          id: {
            purchaseId: null, // Placeholder for actual purchaseId
            goodsId: detail.goodsId,
          },
          amount: detail.amount,
          priceIncome: detail.priceIncome,
        })
      );

      const result = await purchaseApiRequest.createPurchaseDetail(
        purchaseDetails,
        employeeId
      );

      Alert.success("Thành công!", "Phiếu nhập đã được tạo thành công.");
      router.push("/admin/warehouse/inventory");
      router.refresh();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      Alert.error("Có lỗi xảy ra khi thêm chi tiết phiếu nhập");
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
              Tên vật liệu
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/6">
              Số lượng
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider w-1/6">
              Giá nhập
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
              item: { goodsId: number; amount: number; priceIncome: number },
              index: number
            ) => (
              <tr key={index}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Controller
                    name={`details.${index}.goodsId`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value}
                        className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        onChange={(e) => {
                          const selectedGoodsId = Number(e.target.value);
                          field.onChange(selectedGoodsId);
                        }}
                      >
                        <option value={0}>Chọn vật liệu</option>
                        {goodsOptions
                          .filter(
                            (goods) =>
                              !selectedGoods.has(goods.id) ||
                              goods.id === item.goodsId
                          )
                          .map((goods) => (
                            <option key={goods.id} value={goods.id}>
                              {goods.name}
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
                  <Controller
                    name={`details.${index}.priceIncome`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right">
                  {(item.amount * item.priceIncome).toLocaleString()} VND
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
          className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300"
        >
          Lưu phiếu nhập
        </button>
      </div>
    </form>
  );
};

export default PurchaseAddForm;
