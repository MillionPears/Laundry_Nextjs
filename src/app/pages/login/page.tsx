"use client";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div>
      {/* <h1 className="text-xl font-semibold text-center mt-8">Đăng nhập</h1> */}
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
