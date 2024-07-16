import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { registerUser } from "../../api/auth";
import {
  RegisterBody,
  RegisterBodyType,
} from "@/app/schemaValidations/auth.schema";
import authApiRequest from "@/app/apiRequest/auth";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  role: z.number().default(1), // Thêm trường role với giá trị mặc định là 1
});

export default function RegisterForm() {
  // 1. Define your form.
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      username: "",
      password: "",
      role: 1,
    },
  });
  const router = useRouter();

  // 2. Define a submit handler.
  async function onSubmit(values: RegisterBodyType) {
    try {
      const data = await authApiRequest.register(values);
      await authApiRequest.auth({ sessionToken: data.payload.data.token });
      console.log("tokennnn ", data.payload.data.token);
      // await authApiRequest.auth({ sessionToken: data.payload.data.token });
      // setSessionToken(data.payload.data.token);

      router.push("/pages/profile", { scroll: true });
    } catch (error) {
      console.error("Error:", error);
    }
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
                <Input placeholder="username" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Thêm trường password */}
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
              <FormDescription>
                Your password must be at least 6 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
