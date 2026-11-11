
'use client'

import React from 'react'
import Link from 'next/link'
import {
  Package,
  ShoppingBag,
  MessageSquare,
  Plus,
  ArrowUpRight,
  LayoutDashboard
} from 'lucide-react'

const adminLinks = [
  {
    title: 'Products',
    description: 'Manage your store products',
    href: '/admin/products',
    icon: Package
  },
  {
    title: 'Orders',
    description: 'View and manage customer orders',
    href: '/admin/orders',
    icon: ShoppingBag
  },
  {
    title: 'Reviews',
    description: 'Manage customer reviews',
    href: '/admin/reviews',
    icon: MessageSquare
  },
  {
    title: 'Add Product',
    description: 'Add a new Product',
    href: '/admin/products/add-product',
    icon: Plus
  }
]

const AdminPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-gray-500">
            <LayoutDashboard size={18} />
            <span className="text-sm">Admin Dashboard</span>
          </div>

          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your ecommerce store from one place.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {adminLinks.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-400 hover:shadow-md"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-lg bg-gray-100 p-3 text-gray-700">
                    <Icon size={22} />
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="text-gray-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gray-900"
                  />
                </div>

                <h2 className="font-semibold text-gray-900">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {item.description}
                </p>
              </Link>
            )
          })}
        </div>

      </div>
    </main>
  )
}

export default AdminPage
