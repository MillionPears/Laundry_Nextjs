import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  // Extract amount and orderId from request body
  const { amount, invoiceId } = await request.json();

  // Configuration
  const vnp_TmnCode = 'Z986I58P';
  const vnp_HashSecret = 'IN865WDYRPAGZC9OTHCE9GL280LBK7XB';
  const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // Test environment URL

  // Generate a unique transaction reference
  const txnRef = crypto.randomUUID();
  
  // Create the VNPAY parameters
  const date = new Date();
  const vnp_Params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnp_TmnCode,
    vnp_Amount: (amount * 100).toString(), // Amount in VND
    vnp_CurrCode: 'VND',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `Thanh toán cho hóa đơn có số hóa đơn:  ${invoiceId}`,
    vnp_OrderType: 'billpayment',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: `http://localhost:3000/pages/payment-success?invoiceId=${invoiceId}`, // Include invoiceId
    vnp_IpAddr: '127.0.0.1',
    vnp_CreateDate: date.toISOString().slice(0, 19).replace(/[-T:]/g, ''),
  };

  // Sort parameters by key
  const sortedKeys = Object.keys(vnp_Params).sort();
  const sortedParams: Record<string, string> = {};
  for (const key of sortedKeys) {
    sortedParams[key] = vnp_Params[key];
  }

  // Create query string
  const queryString = new URLSearchParams(sortedParams).toString();
  
  // Compute HMAC SHA512 signature
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  hmac.update(queryString, 'utf-8');
  const secureHash = hmac.digest('hex');
  
  // Append the signature to parameters
  const finalParams = new URLSearchParams(sortedParams);
  finalParams.append('vnp_SecureHash', secureHash);

  // Construct the payment URL
  const paymentUrl = `${vnp_Url}?${finalParams.toString()}`;
  
  // Return the payment URL
  return NextResponse.json(paymentUrl);
}
