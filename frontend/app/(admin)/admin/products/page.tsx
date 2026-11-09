'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AlertTriangle, Flame, Loader2, Package, Pencil, Plus, Search, Trash2, X } from 'lucide-react'

import { deleteProduct, getAllProducts } from '@/server/product'
import { productType, Variant } from '@/types'


const effectivePrice = (v: productType['variants'][number]) =>
  v.onSale && v.salePrice != null ? v.salePrice : v.price

const getPriceLabel = (p: productType) => {
  if (!p.variants.length) return '—'
  const prices = p.variants.map(effectivePrice)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max ? min : `${min} – ${max}`
}

const getTotalStock = (p: productType) => p.variants.reduce((sum, v) => sum + v.stock, 0)
const hasSale = (p: productType) => p.variants.some((v) => v.onSale && v.salePrice != null)
const getThumb = (p: productType) => p.variants.find((v) => v.images?.length)?.images[0]

/* ───────── small UI pieces ───────── */

const StockBadge = ({ stock }: { stock: number }) => {
  const style =
    stock === 0
      ? 'bg-red-50 text-red-700 ring-red-600/20'
      : stock <= 5
        ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
        : 'bg-green-50 text-green-700 ring-green-600/20'
  const label = stock === 0 ? 'Out of stock' : stock <= 5 ? `Low · ${stock}` : `${stock} in stock`
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}>
      {label}
    </span>
  )
}

const Thumb = ({ product }: { product: productType }) => {
  const src = getThumb(product)
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
      {src ? (
        <Image src={src} alt={product.name} fill sizes="52px" className="object-cover" />
      ) : (
        <Package className="absolute inset-0 m-auto h-5 w-5 text-gray-400" />
      )}
    </div>
  )
}

const ActionButtons = ({ product, onDelete }: { product: productType; onDelete: (p: productType) => void }) => (
  <div className="flex items-center gap-2">
    <Link
      href={`/admin/products/${product.slug}`}
      aria-label={`Edit ${product.name}`}
      title="Edit"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-black hover:bg-black hover:text-white"
    >
      <Pencil size={16} />
    </Link>
    <button
      onClick={() => onDelete(product)}
      aria-label={`Delete ${product.name}`}
      title="Delete"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
    >
      <Trash2 size={16} />
    </button>
  </div>
)

const getVariants = (v: Variant[]) => {
  return v.map(i => (
    <span key={i.label} className="">( {i.label} -- {i.stock} ) </span>
  ))
}

interface ProductsResponse {
  products: productType[]
  hasMore: boolean
  currentPage: number
  success: boolean
}

/* ───────── page ───────── */

export default function AdminProductsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [toDelete, setToDelete] = useState<productType | null>(null)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<ProductsResponse>({
    queryKey: ['products'],
    queryFn: () => getAllProducts(48),
  })

  const { mutate: removeProduct, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setToDelete(null)
    },
    onError: (err: Error) => toast.error(err.message || 'Could not delete product'),
  })

  const products : productType[] = data?.products ?? []

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      const matchesCategory = category === 'all' || p.category === category
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.variants.some((v) => v.sku.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [products, search, category])

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-8xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              {isLoading ? 'Loading…' : `${products.length} total · ${filtered.length} shown`}
            </p>
          </div>
          <Link
            href="/admin/products/add-product"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <Plus size={18} />
            Add product
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="flex h-11 flex-1 items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-black">
            <Search size={18} className="shrink-0 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU or category"
              aria-label="Search products"
              className="h-full w-full bg-transparent text-sm py-2 md:py-0 text-gray-900 outline-none placeholder:text-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear search" className="text-gray-400 hover:text-gray-700">
                <X size={16} />
              </button>
            )}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-black sm:w-56"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="font-semibold text-gray-900">Couldn&apos;t load products</p>
              <p className="mt-1 text-sm text-gray-500">{(error as Error)?.message}</p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              {isFetching && <Loader2 size={15} className="animate-spin" />}
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <Package className="h-8 w-8 text-gray-400" />
            <p className="font-semibold text-gray-900">{products.length === 0 ? 'No products yet' : 'No matching products'}</p>
            <p className="text-sm text-gray-500">
              {products.length === 0 ? 'Add your first product to get started.' : 'Try a different search or category.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop / tablet: table */}
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-5 py-3.5 font-medium">Product</th>
                      <th className="px-5 py-3.5 font-medium">Category</th>
                      <th className="px-5 py-3.5 font-medium">Price</th>
                      <th className="px-5 py-3.5 font-medium">Stock</th>
                      <th className="px-5 py-3.5 font-medium">Variants</th>
                      <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((p) => (
                      <tr key={p.id} className="transition hover:bg-gray-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <Thumb product={p} />
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 font-semibold text-gray-900">
                                <span className="truncate">{p.name}</span>
                                {p.hotSeller && (
                                  <span title="Hot seller" className="shrink-0 text-orange-500">
                                    <Flame size={15} />
                                  </span>
                                )}
                              </p>
                              <p className="truncate text-xs text-gray-500">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-700">{p.category}</td>
                        <td className="px-5 py-4">
                          <span className="font-medium text-gray-900">PKR {getPriceLabel(p)}</span>
                          {hasSale(p) && (
                            <span className="ml-2 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700">
                              Sale
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <StockBadge stock={getTotalStock(p)} />
                        </td>
                        <td className="px-5 py-4 text-gray-700">{getVariants(p.variants)}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <ActionButtons product={p} onDelete={setToDelete} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile: cards */}
            <ul className="space-y-3 md:hidden">
              {filtered.map((p) => (
                <li key={p.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex gap-4">
                    <Thumb product={p} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 font-semibold text-gray-900">
                        <span className="truncate">{p.name}</span>
                        {p.hotSeller && <Flame size={15} className="shrink-0 text-orange-500" />}
                      </p>
                      <p className="truncate text-xs text-gray-500">{p.category}</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">PKR {getPriceLabel(p)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <div className="space-y-1.5">
                      <StockBadge stock={getTotalStock(p)} />
                      <p className="text-xs text-gray-500">
                        {getVariants(p.variants)}
                        {p.variants.length === 1 ? 'variant' : 'variants'}
                      </p>
                    </div>
                    <ActionButtons product={p} onDelete={setToDelete} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {toDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => !isDeleting && setToDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>
            <h2 id="delete-title" className="text-center text-lg font-semibold text-gray-900">
              Delete product?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              <span className="font-medium text-gray-900">{toDelete.name}</span> and all of its variants will be
              permanently removed. This can&apos;t be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={isDeleting}
                className="h-11 flex-1 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={() => removeProduct(toDelete.id)}
                disabled={isDeleting}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting && <Loader2 size={15} className="animate-spin" />}
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

const LoadingState = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" aria-busy="true">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex animate-pulse items-center gap-4 border-b border-gray-100 p-4 last:border-b-0">
        <div className="h-14 w-14 shrink-0 rounded-lg bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-3 w-1/5 rounded bg-gray-100" />
        </div>
        <div className="hidden h-4 w-20 rounded bg-gray-200 sm:block" />
        <div className="h-9 w-20 rounded-lg bg-gray-100" />
      </div>
    ))}
  </div>
)