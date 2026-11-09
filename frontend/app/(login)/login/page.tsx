
"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { login } from "@/server/auth";
import { loginSchema, LoginFormValues } from "@/lib/schemas/loginSchema";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }} = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: LoginFormValues) =>
      login(values.email, values.password),

    onSuccess: () => {
      toast.success("Login successful", { id: "login" });
      router.push("/admin");
    },

    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const loginSubmit = (values: LoginFormValues) => {
    mutate(values);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">

        {/* Logo / Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
            <LockKeyhole size={26} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Welcome back! Please enter your credentials.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(loginSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <div className={`flex items-center gap-3 rounded-xl border px-4 transition focus-within:border-black ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}>
              <Mail size={18} className="shrink-0 text-gray-400" />

              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="username"
                {...register("email")}
                className="h-12 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>

            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className={`flex items-center gap-3 rounded-xl border px-4 transition focus-within:border-black ${
              errors.password ? "border-red-500" : "border-gray-200"
            }`}>
              <LockKeyhole size={18} className="shrink-0 text-gray-400" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
                className="h-12 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 text-gray-400 transition hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          Protected Admin Area
        </p>
        <Link className="underline text-xs text-center block mt-2 text-zinc-700" href="/">Go Home</Link>
      </div>
    </main>
  );
}
