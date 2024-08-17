import invoiceApiRequest from "@/app/apiRequest/invoice";
import {
  Invoice,
  InvoicesResType,
} from "@/app/schemaValidations/invoice.schema";
import { cookies } from "next/headers";
import InvoiceManagementForm from "./InvoiceManagementForm";

export default async function InvoiceManagementPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  let invoices: InvoicesResType["data"] | null = null;
  if (sessionToken) {
    const result = await invoiceApiRequest.getAll(sessionToken.value);
    invoices = result.payload.data;

    // Xác thực dữ liệu
    invoices = invoices.map((invoice) => {
      return Invoice.parse(invoice);
    });
  }
  return <InvoiceManagementForm invoices={invoices} />;
}
