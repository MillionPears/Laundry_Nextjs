import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import authApiRequest from "@/app/apiRequest/auth";

const getImagePath = (imageName: string) => {
  return `/image/${imageName}.png`;
};

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Họ và tên phải có ít nhất 2 ký tự." }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",

      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: any) {
    try {
      // Xử lý đăng ký ở đây

      // Sau khi đăng ký thành công, chuyển hướng người dùng
      router.push("/pages/profile", { scroll: true });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl h-[90vh] flex">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white shadow-lg">
          {/* <h1 className="text-3xl font-bold mb-8 text-sky-800 text-center">
            Đăng ký
          </h1> */}
          <h1 className="text-4xl font-bold mb-4 text-center">Đăng ký ngay</h1>
          <p className="mb-8 text-center">Giặt ủi nhanh chóng và sạch sẽ</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sky-700">Họ và tên</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập họ và tên"
                        {...field}
                        className="border-sky-200 focus:border-sky-500 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sky-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập password"
                        {...field}
                        className="border-sky-200 focus:border-sky-500 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sky-700">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        {...field}
                        className="border-sky-200 focus:border-sky-500 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="transform transition-transform duration-200 hover:scale-105">
                <Button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 transition-colors duration-300"
                >
                  Đăng ký
                </Button>
              </div>
            </form>
          </Form>
          <p className="mt-6 text-center text-sky-700">
            Đã có tài khoản rồi?{" "}
            <a
              href="/pages/login"
              className="text-sky-600 hover:underline transition-all duration-300"
            >
              Đăng nhập
            </a>
          </p>
        </div>

        <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center p-8">
          <Image
            src={getImagePath("process_nhando")}
            alt="Washing Machine"
            width={500}
            height={500}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg  transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
}
