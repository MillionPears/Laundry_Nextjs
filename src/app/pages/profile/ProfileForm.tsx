"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  ProfileResType,
  ProfileSchema,
  UpdateProfileBody,
  UpdateProfileBodyType,
} from "@/app/schemaValidations/profile.schema";
import profileApiRequest from "@/app/apiRequest/profile";
import { useRef, useState } from "react";

type Profile = ProfileResType["data"];

export default function ProfileForm({ profile }: { profile: Profile }) {
  const form = useForm<UpdateProfileBodyType>({
    resolver: zodResolver(UpdateProfileBody),
    defaultValues: {
      username: "million",
      name: profile.name,
      address: profile.address,
      hobbie: profile.hobbie,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      avatar: "",
    },
  });
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const avatar = form.watch("avatar");
  async function onSubmit(values: UpdateProfileBodyType) {
    try {
      const data = await profileApiRequest.updateProfile(5, values);
      console.log(data.payload.message); // Log response message if needed
      router.push("/pages/profile");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-blue-100 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-8">Update Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-8">
          <div className="w-7/12 space-y-6">
            <FormItem>
              <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  value="million"
                  readOnly
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your address"
                      {...field}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  type="string"
                  value={profile.phoneNumber}
                  readOnly
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="hobbie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                    Hobbie
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your hobby"
                      {...field}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-5/12 space-y-6 flex flex-col items-center">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={inputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFile(file);
                          field.onChange(file.name);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(file || avatar) && (
              <div>
                <Image
                  src={file ? URL.createObjectURL(file) : avatar}
                  width={128}
                  height={128}
                  alt="preview"
                  className="w-32 h-32 object-cover"
                />
                <Button
                  type="button"
                  variant={"destructive"}
                  size={"sm"}
                  onClick={() => {
                    setFile(null);
                    form.setValue("avatar", "");
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
                >
                  Xóa hình ảnh
                </Button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {profile ? "Cập nhật thông tin" : "Thêm thông tin cá nhân"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}