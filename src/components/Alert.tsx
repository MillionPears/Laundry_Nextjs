// AlertComponent.tsx
import goodsApiRequest from "@/app/apiRequest/goods";
import Swal from "sweetalert2";

export type OrderItem = {
  serviceName: string;
  quantity: number;
  price: number; // Giá mỗi dịch vụ
  total: number; // Thành tiền từng dịch vụ
};

const AlertComponent = {
  success: (title?: string, text?: string) => {
    Swal.fire({
      title: title || "Success!",
      text: text || "Operation completed successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });
  },

  error: (title?: string, text?: string) => {
    Swal.fire({
      title: title || "Error!",
      text: text || "Something went wrong.",
      icon: "error",
      confirmButtonText: "OK",
    });
  },

  info: (title?: string, text?: string) => {
    Swal.fire({
      title: title || "Information",
      text: text || "Here is some information.",
      icon: "info",
      confirmButtonText: "OK",
    });
  },

  warning: (title?: string, text?: string) => {
    Swal.fire({
      title: title || "Warning!",
      text: text || "Please be careful.",
      icon: "warning",
      confirmButtonText: "OK",
    });
  },

  orderDetails: ({
    orderId,
    items,
    totalAmount,
  }: {
    orderId: number;
    items: OrderItem[];
    totalAmount: number;
  }) => {
    const generateOrderTable = () => {
      // Tạo định dạng tiền tệ VND
      const currencyFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      });

      let rows = items
        .map(
          (item) => `
      <tr class="hover:bg-blue-50">
        <td class="px-4 py-2 border-b border-gray-200 text-left">${
          item.serviceName
        }</td>
        <td class="px-4 py-2 border-b border-gray-200 text-center">${
          item.quantity
        }</td>
        <td class="px-4 py-2 border-b border-gray-200 text-center">${currencyFormatter.format(
          item.price
        )}</td>
        <td class="px-4 py-2 border-b border-gray-200 text-center">${currencyFormatter.format(
          item.total
        )}</td>
      </tr>
    `
        )
        .join("");

      return `
    <table class="min-w-full divide-y divide-gray-200" style="width: 100%; border-collapse: collapse;">
      <thead class="bg-blue-100 text-blue-800">
        <tr>
          <th class="px-4 py-2 border-b border-gray-300 text-left">Tên dịch vụ</th>
          <th class="px-4 py-2 border-b border-gray-300 text-center">Số lượng</th>
          <th class="px-4 py-2 border-b border-gray-300 text-center">Giá</th>
          <th class="px-4 py-2 border-b border-gray-300 text-center">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="bg-blue-50">
          <td colspan="3" class="px-4 py-2 border-b border-gray-200 text-right font-bold">Tổng tiền:</td>
          <td class="px-4 py-2 border-b border-gray-200 font-bold text-center">${currencyFormatter.format(
            totalAmount
          )}</td>
        </tr>
      </tbody>
    </table>
  `;
    };

    Swal.fire({
      title: `Chi tiết đơn hàng ${orderId}`, // Tiêu đề bảng
      html: generateOrderTable(), // Tạo bảng chi tiết đơn hàng
      width: "80%",
      padding: "20px",
      showCloseButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      customClass: {
        container: "custom-swal-container",
      },
    });
  },
  addGoods: async () => {
    const { value: formValues } = await Swal.fire({
      title: "Thêm thông tin vật liệu",
      html: `
       <div class="p-4 space-y-4">
  <div class="flex flex-col gap-4">
    <div class="flex flex-col">
      <label for="swal-input-name" class="mb-1 text-sm font-medium">Tên vật liệu</label>
      <input id="swal-input-name" class="block w-full p-2 border rounded-md" placeholder="Tên vật liệu" required>
    </div>
    <div class="flex flex-col">
      <label for="swal-select-status" class="mb-1 text-sm font-medium">Trạng thái</label>
      <select id="swal-select-status" class="block w-full p-2 border rounded-md">
        <option value="true">Hoạt động</option>
        <option value="false">Không hoạt động</option>
      </select>
    </div>
  </div>
</div>


      `,
      focusConfirm: false,
      preConfirm: () => {
        const goodsName = (
          document.getElementById("swal-input-name") as HTMLInputElement
        ).value;
        const active =
          (document.getElementById("swal-select-status") as HTMLSelectElement)
            .value === "true";

        if (!goodsName) {
          Swal.showValidationMessage("Vui lòng điền tên vật liệu.");
          return null;
        }

        return {
          goodsName,
          active,
          image: "",
          amount: 0,
        };
      },
      confirmButtonText: "Lưu",
      showCancelButton: true,
      cancelButtonText: "Hủy",
      customClass: {
        container: "custom-swal-container",
      },
    });

    if (formValues) {
      try {
        await goodsApiRequest.createGoods(formValues);
        AlertComponent.success(
          "Thành công!",
          "Thông tin vật liệu đã được lưu."
        );
      } catch (error) {
        AlertComponent.error("Lỗi!", "Có lỗi xảy ra khi lưu thông tin.");
      }
    }
  },
  purchaseDetails: ({
    purchaseId,
    items,
    totalAmount,
  }: {
    purchaseId: number;
    items: {
      goodsName: string;
      quantity: number;
      price: number;
      total: number;
    }[];
    totalAmount: number;
  }) => {
    const generatePurchaseTable = () => {
      const currencyFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      });

      let rows = items
        .map(
          (item) => `
      <tr class="hover:bg-blue-50">
        <td class="px-4 py-2 border-b border-gray-200 text-left"> ${
          item.goodsName
        }</td>
        <td class="px-4 py-2 border-b border-gray-200 text-center">${
          item.quantity
        }</td>
        <td class="px-4 py-2 border-b border-gray-200 text-center">${currencyFormatter.format(
          item.price
        )}</td>
        <td class="px-4 py-2 border-b border-gray-200 text-center">${currencyFormatter.format(
          item.total
        )}</td>
      </tr>
    `
        )
        .join("");

      return `
    <table class="min-w-full divide-y divide-gray-200" style="width: 100%; border-collapse: collapse;">
      <thead class="bg-blue-100 text-blue-800">
        <tr>
          <th class="px-4 py-2 border-b border-gray-300 text-left">Mã vật liệu</th>
          <th class="px-4 py-2 border-b border-gray-300 text-center">Số lượng nhập</th>
          <th class="px-4 py-2 border-b border-gray-300 text-center">Giá nhập</th>
          <th class="px-4 py-2 border-b border-gray-300 text-center">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="bg-blue-50">
          <td colspan="3" class="px-4 py-2 border-b border-gray-200 text-right font-bold">Tổng tiền:</td>
          <td class="px-4 py-2 border-b border-gray-200 font-bold text-center">${currencyFormatter.format(
            totalAmount
          )}</td>
        </tr>
      </tbody>
    </table>
  `;
    };

    Swal.fire({
      title: `Chi tiết phiếu nhập ${purchaseId}`,
      html: generatePurchaseTable(),
      width: "80%",
      padding: "20px",
      showCloseButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      customClass: {
        container: "custom-swal-container",
      },
    });
  },
  goodsDetails: ({
    goodsId,
    goodsName,
    amount,
    active,
    threshold,
    image,
    onSave,
  }: {
    goodsId: number;
    goodsName: string;
    amount: number;
    active: boolean;
    threshold: number;
    image: string;
    onSave: (updatedGoods: {
      goodsId: number;
      goodsName: string;
      active: boolean;
      threshold: number;
      image: string;
      amount: number;
    }) => void;
  }) => {
    let isEditing = false;

    const generateGoodsTable = () => {
      return `
      <table class="min-w-full divide-y divide-gray-200" style="width: 100%; border-collapse: collapse;">
        <thead class="bg-blue-100 text-blue-800">
          <tr>
            <th class="px-4 py-2 border-b border-gray-300 text-left">Thuộc tính</th>
            <th class="px-4 py-2 border-b border-gray-300 text-center">Giá trị</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-blue-50">
            <td class="px-4 py-2 border-b border-gray-200 text-left">Tên vật liệu</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">
              <span id="display-goodsName">${goodsName}</span>
              <input id="input-goodsName" class="swal2-input" type="text" value="${goodsName}" style="display: none;" />
            </td>
          </tr>
          <tr class="hover:bg-blue-50">
            <td class="px-4 py-2 border-b border-gray-200 text-left">Số lượng tồn</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">${amount}</td>
          </tr>
          <tr class="hover:bg-blue-50">
            <td class="px-4 py-2 border-b border-gray-200 text-left">Ngưỡng</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">
              <span id="display-threshold">${threshold}</span>
              <input id="input-threshold" class="swal2-input" type="number" value="${threshold}" style="display: none;" />
            </td>
          </tr>
          <tr class="hover:bg-blue-50">
            <td class="px-4 py-2 border-b border-gray-200 text-left">Trạng thái</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">
              <span id="display-active">${
                active ? "Hoạt động" : "Không hoạt động"
              }</span>
              <select id="input-active" class="swal2-input" style="display: none;">
                <option value="true" ${
                  active ? "selected" : ""
                }>Hoạt động</option>
                <option value="false" ${
                  !active ? "selected" : ""
                }>Không hoạt động</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    };

    Swal.fire({
      title: `Chi tiết mặt hàng ${goodsName}`,
      html: `
    ${generateGoodsTable()}
    <button id="editButton" class="swal2-confirm swal2-styled">Sửa</button>
  `,
      width: "50%",
      padding: "20px",
      showCloseButton: true,

      preConfirm: () => {
        if (isEditing) {
          const updatedGoodsName = (
            document.getElementById("input-goodsName") as HTMLInputElement
          ).value;
          const updatedThreshold = parseInt(
            (document.getElementById("input-threshold") as HTMLInputElement)
              .value,
            10
          );
          const updatedActive =
            (document.getElementById("input-active") as HTMLSelectElement)
              .value === "true";

          return {
            goodsId,
            goodsName: updatedGoodsName,
            threshold: updatedThreshold,
            active: updatedActive,
            image: "",
            amount,
          };
        }
      },
      didOpen: () => {
        const editButton = document.getElementById("editButton");
        if (editButton) {
          editButton.addEventListener("click", () => {
            isEditing = true;

            // Show input fields and hide text spans
            const displayGoodsNameElement =
              document.getElementById("display-goodsName");
            const displayThresholdElement =
              document.getElementById("display-threshold");
            const displayActiveElement =
              document.getElementById("display-active");
            const inputGoodsNameElement = document.getElementById(
              "input-goodsName"
            ) as HTMLInputElement;
            const inputThresholdElement = document.getElementById(
              "input-threshold"
            ) as HTMLInputElement;
            const inputActiveElement = document.getElementById(
              "input-active"
            ) as HTMLSelectElement;

            if (displayGoodsNameElement)
              displayGoodsNameElement.style.display = "none";
            if (displayThresholdElement)
              displayThresholdElement.style.display = "none";
            if (displayActiveElement)
              displayActiveElement.style.display = "none";

            if (inputGoodsNameElement)
              inputGoodsNameElement.style.display = "inline-block";
            if (inputThresholdElement)
              inputThresholdElement.style.display = "inline-block";
            if (inputActiveElement)
              inputActiveElement.style.display = "inline-block";

            const confirmButton = Swal.getConfirmButton();
            const cancelButton = Swal.getCancelButton();

            if (confirmButton) confirmButton.style.display = "inline-block";
            if (cancelButton) cancelButton.style.display = "none";
          });
        }
      },
    }).then((result) => {
      if (result.isConfirmed && isEditing) {
        onSave(result.value);
      }
    });
  },
};

export default AlertComponent;
