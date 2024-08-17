"use client";
import React, { useState } from "react";
import {
  PhoneAuthProvider,
  signInWithCredential,
  getAuth,
} from "firebase/auth";

interface PhoneVerificationProps {
  verificationId: string | null;
  onVerify: (otp: string) => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  verificationId,
  onVerify,
}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!verificationId) {
      setError("Không có ID xác thực. Vui lòng thử lại.");
      return;
    }

    try {
      const auth = getAuth();
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      onVerify(otp);
    } catch (error: any) {
      console.error("Lỗi xác thực OTP:", error);
      if (error.code === "auth/invalid-verification-code") {
        setError("Mã OTP không hợp lệ. Vui lòng thử lại.");
      } else {
        setError("Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Xác thực số điện thoại
        </h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Nhập mã OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mã 6 số"
              maxLength={6}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneVerification;
