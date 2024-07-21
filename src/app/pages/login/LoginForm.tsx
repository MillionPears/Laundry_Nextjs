import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Changed to "next/router"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "../../schemaValidations/auth.schema";
import authApiRequest from "@/app/apiRequest/auth";
import Image from "next/image";

const getImagePath = (imageName: string) => {
  return `/image/${imageName}.png`; // Update the path based on the image name
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

  async function onSubmit(values: LoginBodyType) {
    try {
      const data = await authApiRequest.login(values);

      await authApiRequest.auth({
        sessionToken: data.payload.data.token,
        username: data.payload.data.username,
        userId: data.payload.data.userId,
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleRegisterLinkClick(event: React.MouseEvent) {
    event.preventDefault();
    router.push("/pages/register"); // Navigate to the registration page when the link is clicked
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
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
                  onClick={handleRegisterLinkClick}
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
            src={getImagePath("process_nhando")}
            alt="Washing Machine"
            width={500}
            height={500}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
