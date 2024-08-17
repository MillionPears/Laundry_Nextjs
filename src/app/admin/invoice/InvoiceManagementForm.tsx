"use client";

import { InvoicesResType } from "@/app/schemaValidations/invoice.schema";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import invoiceApiRequest from "@/app/apiRequest/invoice";
import Alert from "@/components/Alert";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const InvoiceManagementForm = ({
  invoices,
}: {
  invoices: InvoicesResType["data"] | null;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const invoicesPerPage = 12;
  const [updatedInvoices, setUpdatedInvoices] = useState<
    InvoicesResType["data"] | null
  >(invoices);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "transfer" | null
  >(null);
  const router = useRouter();

  const filterInvoices = (status: number | null, date: string | null) => {
    if (!updatedInvoices) return [];
    let filtered = updatedInvoices;

    if (status !== null) {
      filtered = filtered.filter((invoice) => invoice.paymentStatus === status);
    }

    if (date) {
      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.createdDate);
        return format(invoiceDate, "yyyy-MM-dd") === date;
      });
    }

    return filtered;
  };

  const sortInvoices = (
    invoices: InvoicesResType["data"] | null,
    order: "asc" | "desc"
  ) => {
    if (!invoices) return [];
    return [...invoices].sort((a, b) => {
      return order === "asc"
        ? a.totalPrice - b.totalPrice
        : b.totalPrice - a.totalPrice;
    });
  };

  const paginatedInvoices = (invoices: InvoicesResType["data"] | null) => {
    const filteredInvoices = filterInvoices(selectedStatus, selectedDate);
    const sortedInvoices = sortInvoices(filteredInvoices, sortOrder);
    const startIndex = (currentPage - 1) * invoicesPerPage;
    const endIndex = startIndex + invoicesPerPage;
    return sortedInvoices.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    (filterInvoices(selectedStatus, selectedDate)?.length || 0) /
      invoicesPerPage
  );

  const currentInvoices = paginatedInvoices(updatedInvoices);

  const handleUpdateStatus = async (invoiceId: number) => {
    try {
      const result = await invoiceApiRequest.updateStatus(invoiceId);
      setUpdatedInvoices(
        (prevInvoices) =>
          prevInvoices?.map((invoice) =>
            invoice.invoiceId === invoiceId
              ? { ...invoice, paymentStatus: 1 }
              : invoice
          ) || null
      );
      Alert.success("Thành công!", result.payload.message);
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handlePaymentMethodSelection = async (method: "cash" | "transfer") => {
    setPaymentMethod(method);
    setIsPaymentDialogOpen(false); // Close the payment method selection dialog

    if (method === "cash") {
      setIsConfirmationDialogOpen(true); // Open the confirmation dialog for cash
    } else {
      // Handle transfer payment
      if (selectedInvoiceId !== null) {
        // Find the selected invoice to get the total price
        const selectedInvoice = updatedInvoices?.find(
          (invoice) => invoice.invoiceId === selectedInvoiceId
        );

        if (selectedInvoice) {
          try {
            const paymentResponse = await fetch("/api/auth/payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: selectedInvoice.totalPrice, // Use the total price from the selected invoice
                invoiceId: selectedInvoiceId, // Use the ID of the selected invoice
              }),
            });

            if (paymentResponse.ok) {
              const paymentUrl = await paymentResponse.json();
              window.location.href = paymentUrl; // Redirect to the VNPAY payment URL
            } else {
              alert("Có lỗi xảy ra khi tạo đơn hàng!");
            }
          } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            alert("Có lỗi xảy ra khi xử lý thanh toán!");
          }
        } else {
          alert("Hóa đơn không tồn tại!");
        }
      } else {
        alert("Chưa chọn hóa đơn!");
      }
    }
  };

  const handleConfirmation = async () => {
    if (paymentMethod === "cash" && selectedInvoiceId !== null) {
      // Proceed with the update status if the user confirms
      await handleUpdateStatus(selectedInvoiceId);
    }
    setIsConfirmationDialogOpen(false); // Close the confirmation dialog
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStatus(1)}
          className={`px-4 py-2 text-white rounded transition-colors duration-300 ease-in-out ${
            selectedStatus === 1
              ? "bg-green-600 shadow-lg"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Đã thanh toán
        </button>
        <button
          onClick={() => setSelectedStatus(0)}
          className={`px-4 py-2 text-white rounded transition-colors duration-300 ease-in-out ${
            selectedStatus === 0
              ? "bg-red-600 shadow-lg"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Chưa thanh toán
        </button>
        <button
          onClick={() => setSelectedStatus(null)}
          className={`px-4 py-2 text-white rounded transition-colors duration-300 ease-in-out ${
            selectedStatus === null
              ? "bg-blue-700 shadow-lg"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Tất cả
        </button>
        <div className="ml-auto flex gap-2 items-center">
          <input
            type="date"
            onChange={(e) => setSelectedDate(e.target.value || null)}
            className="p-2 border rounded"
          />
          <button
            onClick={() =>
              setSortOrder((order) => (order === "asc" ? "desc" : "asc"))
            }
            className="px-4 py-2 text-white rounded bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
          >
            Sắp xếp theo giá {sortOrder === "asc" ? "Giảm" : "Tăng"}
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-4 gap-6"
        style={{ gridTemplateRows: "repeat(3, minmax(0, 1fr))" }}
      >
        {currentInvoices.map((invoice) => (
          <div
            key={invoice.invoiceId}
            className={`relative shadow-lg rounded-lg overflow-hidden p-4 transition-transform transform hover:scale-105 hover:shadow-2xl ${
              invoice.paymentStatus === 1
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {invoice.paymentStatus === 1 && (
              <div className="absolute top-2 right-2 opacity-90 text-green-700 animate-stamp">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm13.22-2.72a.75.75 0 00-1.06-1.06L9.75 13.88l-2.47-2.47a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.06 0l5.25-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            {invoice.paymentStatus === 0 && (
              <div
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-80 hover:opacity-100 cursor-pointer"
                onClick={() => {
                  setSelectedInvoiceId(invoice.invoiceId);
                  setIsPaymentDialogOpen(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-gray-700"
                >
                  <path d="M12 3v9.29l5.12 3.05.88-1.52-4-2.33V4h-1.12L12 3z" />
                </svg>
              </div>
            )}
            <div className="mb-4">
              <p className="text-lg font-semibold">
                Số hóa đơn: {invoice.invoiceId}
              </p>
              <p className="text-sm">Mã đơn hàng: {invoice.orderId}</p>
              <p className="text-sm">
                Ngày tạo:{" "}
                {format(new Date(invoice.createdDate), "dd/MM/yyyy HH:mm")}
              </p>
              <p className="text-sm">
                Tổng tiền:{" "}
                {invoice.totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          className={`px-4 py-2 text-white rounded transition-colors duration-300 ease-in-out ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} của {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((page) => Math.min(page + 1, totalPages))
          }
          className={`px-4 py-2 text-white rounded transition-colors duration-300 ease-in-out ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={currentPage === totalPages}
        >
          Trang sau
        </button>
      </div>

      <AlertDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <button
            className="hidden" // Giữ cho dialog mở mà không cần trigger button
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Chọn phương thức thanh toán</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng chọn phương thức thanh toán để tiếp tục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded mr-4"
              onClick={() => handlePaymentMethodSelection("cash")}
            >
              Tiền mặt
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => handlePaymentMethodSelection("transfer")}
            >
              Chuyển khoản
            </button>
            <AlertDialogCancel
              className="px-4 py-2 bg-gray-500 text-white rounded ml-4"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Hủy
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <button className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thanh toán</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thanh toán bằng tiền mặt không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="px-4 py-2 bg-green-500 text-white rounded mr-4"
              onClick={handleConfirmation}
            >
              Xác nhận
            </AlertDialogAction>
            <AlertDialogCancel
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => setIsConfirmationDialogOpen(false)}
            >
              Hủy
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceManagementForm;
