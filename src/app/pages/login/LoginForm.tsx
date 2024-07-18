import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Thay đổi từ "next/navigation" thành "next/router"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "../../schemaValidations/auth.schema";
import authApiRequest from "@/app/apiRequest/auth";
import { useAppContext } from "@/app/app-provider";

export default function LoginForm() {
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const router = useRouter();
  //const { user } = useAppContext();

  async function onSubmit(values: LoginBodyType) {
    try {
      const data = await authApiRequest.login(values);

      await authApiRequest.auth({
        sessionToken: data.payload.data.token,
        username: data.payload.data.username,
      });
      // if (user && user.username) {
      //   const roleData = await authApiRequest.roleid(user?.username);
      //   if (roleData.payload.roleid == 1) {
      //   }
      // }

      router.push("/", { scroll: true });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleRegisterLinkClick() {
    router.push("/pages/register"); // Điều hướng đến trang đăng ký khi click vào link
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="enter your username" {...field} />
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
        <p className="text-center">
          Bạn chưa có tài khoản?{" "}
          <a
            href="/pages/register"
            onClick={handleRegisterLinkClick}
            className="text-blue-500"
          >
            Đăng ký
          </a>
        </p>
        <Button type="submit">Đăng nhập</Button>
      </form>
    </Form>
  );
}
