import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Đã thay đổi thành "next/router"
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "../schemaValidations/auth.schema";
import authApiRequest from "@/app/apiRequest/auth";
import Image from "next/image";
import Spinner from "@/components/Spinne";

const getImagePath = (imageName: string) => {
  return `/image/${imageName}.png`; // Cập nhật đường dẫn dựa trên tên hình ảnh
};

export default function LoginForm() {
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: LoginBodyType) {
    setIsLoading(true);
    try {
      const data = await authApiRequest.login(values);

      await authApiRequest.auth({
        sessionToken: data.payload.data.token,
        username: data.payload.data.username,
        userId: data.payload.data.userId,
      });
      const roleData = await authApiRequest.roleid(
        data.payload.data.username,
        data.payload.data.token
      );
      if (roleData.payload.data === 1) {
        router.push("/");
      } else {
        router.push("/admin");
      }
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onRegister(event: React.MouseEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Gọi API hoặc xử lý đăng ký ở đây
      router.push("/pages/register"); // Điều hướng đến trang đăng ký
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner isLoading={isLoading} /> {/* Sử dụng Spinner component */}
      <div className="w-full max-w-4xl h-[90vh] flex">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Chào mừng bạn đến với Fauget Laundry
          </h1>
          <p className="mb-8 text-center">Giặt ủi nhanh chóng và sạch sẽ</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full max-w-md"
              method="POST" // Sử dụng phương thức POST để gửi form
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between text-sm">
                <a href="#" className="text-gray-600">
                  Nhớ mật khẩu
                </a>
                <a href="#" className="text-gray-600">
                  quên mật khẩu?
                </a>
              </div>
              <Button type="submit" className="w-full bg-blue-500 text-white">
                Đăng nhập
              </Button>
              <p className="text-center mt-4">
                Bạn chưa có tài khoản?{" "}
                <a
                  href="#"
                  onClick={onRegister} // Sử dụng hàm onRegister
                  className="text-blue-500"
                >
                  Đăng ký
                </a>
              </p>
            </form>
          </Form>
        </div>
        <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center p-8">
          <Image
            src={getImagePath("laundry-shop")}
            alt="Washing Machine"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
