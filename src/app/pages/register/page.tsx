"use client";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold text-center mt-8">Đăng ký</h1>
      <div className="flex justify-center">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
