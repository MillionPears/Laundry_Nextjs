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

import { useAppContext } from "@/app/app-provider";
import { use, useEffect, useRef, useState } from "react";
import {
  CustomerResType,
  StaffResType,
} from "@/app/schemaValidations/auth.schema";
import Spinner from "@/components/Spinne";
import profileApiRequest from "@/app/apiRequest/profile";

export default function ProfileForm({
  user,
}: {
  user: CustomerResType["data"] | StaffResType["data"] | null;
}) {
  const router = useRouter();

  const form = useForm<UpdateProfileBodyType>({
    resolver: zodResolver(UpdateProfileBody),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      avatar: user?.avatar || "",
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const avatar = form.watch("avatar");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: UpdateProfileBodyType) {
    setIsLoading(true); // Start loading spinner
    try {
      const result = await profileApiRequest.updateProfile;
      router.push("/pages/profile");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-blue-100 p-8 rounded-lg shadow-lg">
      <Spinner isLoading={isLoading} />
      <h2 className="text-2xl font-bold text-blue-600 mb-8">Update Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-8">
          <div className="w-7/12 space-y-6">
            {/* Conditionally render username field */}
            {user && (
              <FormItem>
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    value={user?.username}
                    readOnly
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </FormControl>
              </FormItem>
            )}
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
                      value={field.value}
                      onChange={field.onChange}
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
                  placeholder="email"
                  value={user?.email}
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
                  placeholder="phoneNumber"
                  type="string"
                  value={user?.phoneNumber}
                  readOnly
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </FormControl>
            </FormItem>
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

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {user ? "Cập nhật thông tin" : "Thêm thông tin cá nhân"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
