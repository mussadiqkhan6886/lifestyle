
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "@/server/auth";

const navItems = [
  { name: "Products", href: "/admin/products" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Add Product", href: "/admin/products/add-product" },
  { name: "Reviews", href: "/admin/reviews" },
];

export default function AdminHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const data = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/admin/login");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleLogout = () => {
    data.mutate();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">

          {/* Left Side */}
          <Link
            href="/admin"
            className="text-lg font-bold text-gray-900"
          >
            Admin Dashboard
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition text-black`}
                >
                  {item.name}
                </Link>
              );
            })}

            <button
              type="button"
              disabled={data.isPending}
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700 disabled:opacity-50"
            >
              <LogOut size={17} />
              {data.isPending ? "Logging out..." : "Logout"}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <h2 className="font-semibold text-gray-900">
            Navigation
          </h2>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 space-y-2 p-5">
          {navItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition text-black`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Logout */}
        <div className="border-t border-gray-100 p-5">
          <button
            type="button"
            disabled={data.isPending}
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut size={18} />
            {data.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
