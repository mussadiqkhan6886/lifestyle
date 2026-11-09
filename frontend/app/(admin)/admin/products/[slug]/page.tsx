'use client'

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import imageCompression from 'browser-image-compression'
import { toast } from 'sonner'
import { collections } from '@/lib/constants'
import { getProductBySlug, updateProduct } from '@/server/product'
import { productType } from '@/types'
import { ProductFormValues, productSchema } from '@/lib/schemas/productSchema'

const MAX_IMAGES = 20

const createEmptyVariant = (): ProductFormValues['variants'][number] => ({
  label: '',
  sku: '',
  stock: 0,
  price: 0,
  onSale: false,
  salePrice: undefined,
  images: [],
})

const categoryOptions = collections.map((c) => ({
  title: c.title,
  value: c.link.split('/').pop() as string,
}))

const Loading = () => {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-10" aria-busy="true">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-8 w-56 rounded bg-gray-200" />
        <div className="h-72 rounded-2xl bg-gray-200" />
        <div className="h-96 rounded-2xl bg-gray-200" />
      </div>
    </main>
  )
}

const EditProductContent = () => {
  const { slug } = useParams<{ slug: string }>()
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<productType>({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  })

  if (isLoading) {
    return <Loading />
  }

  if (isError || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
        <div className="max-w-sm space-y-4 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-gray-900">Couldn&apos;t load this product</p>
          <p className="text-sm text-gray-500">{(error as Error)?.message || 'Product not found.'}</p>
          <div className="flex justify-center gap-3">
            <Link
              href="/admin/products"
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </Link>
            <button
              onClick={() => refetch()}
              className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    )
  }

  // key => a fresh form if you navigate between two products
  return <EditProductForm key={product.id} product={product} />
}

function ImagePreview({ image, onRemove }: { image: string | File; onRemove: () => void }) {
  const [preview, setPreview] = useState(typeof image === 'string' ? image : '')
  const isNew = typeof image !== 'string'

  useEffect(() => {
    if (typeof image === 'string') {
      setPreview(image)
      return
    }
    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [image])

  return (
    <div className="relative">
      {preview && (
        <Image
          width={100}
          height={100}
          src={preview}
          alt={typeof image === 'string' ? 'Product image' : image.name}
          unoptimized
          className="h-24 w-24 rounded-lg border object-cover"
        />
      )}

      {isNew && (
        <span className="absolute left-1 top-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          New
        </span>
      )}

      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
      >
        ×
      </button>

      <p className="mt-1 max-w-24 truncate text-xs text-gray-500">
        {typeof image === 'string' ? 'Saved image' : image.name}
      </p>
    </div>
  )
}

function EditProductForm({ product }: { product: productType }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [compressionMessage, setCompressionMessage] = useState('')

  const defaultValues: ProductFormValues = {
    name: product.name,
    slug: product.slug,
    category: product.category,
    description: product.description,
    hotSeller: product.hotSeller ?? false,
    variants: product.variants.map((v) => ({
      label: v.label,
      sku: v.sku ?? '',
      stock: v.stock,
      price: v.price,
      onSale: v.onSale ?? false,
      salePrice: v.salePrice ?? undefined,
      images: v.images ?? [],
    })),
  }

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' })
  const watchedVariants = useWatch({ control, name: 'variants' })

  const mutation = useMutation({
    mutationFn: (formData: FormData) => updateProduct(product.id, formData),
    onSuccess: () => {
      toast.success('Product updated successfully!', { id: 'p' })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['product', product.id] })
      router.push('/admin/products')
    },
    onError: (err: Error) => toast.error(err.message || 'Something went wrong', { id: 'p' }),
  })

  // If the saved category isn't one of the current options, keep it selectable
  const categoryInList = categoryOptions.some((o) => o.value === product.category)

  const handleImageChange = async (variantIndex: number, files: FileList | null) => {
    if (!files || files.length === 0) return

    const selectedFiles = Array.from(files)

    if (selectedFiles.some((file) => !file.type.startsWith('image/'))) {
      toast.error('Please select image files only.')
      return
    }

    const existingImages = getValues(`variants.${variantIndex}.images`) || []
    const totalImages = getValues('variants').reduce((total, v) => total + v.images.length, 0)

    if (totalImages + selectedFiles.length > MAX_IMAGES) {
      toast.error(`You can have a maximum of ${MAX_IMAGES} images.`)
      return
    }

    try {
      setCompressionMessage('Compressing images...')

      const compressedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
          })
          return new File([compressed], file.name, { type: compressed.type, lastModified: Date.now() })
        })
      )

      setValue(`variants.${variantIndex}.images`, [...existingImages, ...compressedFiles], {
        shouldDirty: true,
        shouldValidate: true,
      })
      setCompressionMessage('Images compressed successfully.')
    } catch (error) {
      console.error('Image compression error:', error)
      setCompressionMessage('Image compression failed.')
    }
  }

  const removeImage = (variantIndex: number, imageIndex: number) => {
    const current = getValues(`variants.${variantIndex}.images`) || []
    setValue(
      `variants.${variantIndex}.images`,
      current.filter((_, i) => i !== imageIndex),
      { shouldDirty: true, shouldValidate: true }
    )
  }

  const onSubmit = (values: ProductFormValues) => {
    const formData = new FormData()

    formData.append('name', values.name)
    formData.append('slug', values.slug || '')
    formData.append('category', values.category)
    formData.append('description', values.description)
    formData.append('hotSeller', String(values.hotSeller))

    const variantsForBackend = values.variants.map(({ images, ...variant }) => ({
      ...variant,
      sku: variant.sku || '',
      salePrice: variant.onSale ? variant.salePrice : null,
      existingImages: images.filter((img): img is string => typeof img === 'string'),
    }))
    formData.append('variants', JSON.stringify(variantsForBackend))

    // Only NEW files are uploaded, with the variant index each belongs to
    const variantIndices: number[] = []
    values.variants.forEach((variant, variantIndex) => {
      variant.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image)
          variantIndices.push(variantIndex)
        }
      })
    })
    formData.append('variantIndices', JSON.stringify(variantIndices))

    mutation.mutate(formData)
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <span>Dashboard</span>
              <span>/</span>
              <Link href="/admin/products" className="hover:text-gray-900">
                Products
              </Link>
              <span>/</span>
              <span className="font-medium text-gray-900">Edit</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950">Edit Product</h1>
            <p className="mt-2 text-sm text-gray-500">
              Update details, variants and images for{' '}
              <span className="font-medium text-gray-800">{product.name}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Editing
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          {/* PRODUCT INFORMATION */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
              <h2 className="font-semibold text-gray-950">Product Information</h2>
              <p className="text-sm text-gray-500">Basic details about your product.</p>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input {...register('name')} placeholder="e.g. Classic Leather Watch" className={'inputClass'} />
                {errors.name && <p className="mt-2 text-xs font-medium text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Product Slug</label>
                <input {...register('slug')} placeholder="classic-leather-watch" className={'inputClass'} />
                <p className="mt-1.5 text-xs text-gray-400">
                  Changing the slug changes this product&apos;s URL. Leave empty to regenerate from the name.
                </p>
                {errors.slug && <p className="mt-2 text-xs text-red-500">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select {...register('category')} className={'inputClass'}>
                  <option value="" disabled>
                    Select a category
                  </option>
                  {!categoryInList && product.category && (
                    <option value={product.category}>{product.category} (current)</option>
                  )}
                  {categoryOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.title}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-2 text-xs text-red-500">{errors.category.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description')}
                  rows={5}
                  placeholder="Write a detailed description of your product..."
                  className={`${'inputClass'} resize-y`}
                />
                {errors.description && <p className="mt-2 text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Featured / Hot Seller</p>
                    <p className="mt-1 text-xs text-gray-500">Highlight this product in your store.</p>
                  </div>
                  <input type="checkbox" {...register('hotSeller')} className="h-5 w-5 cursor-pointer accent-blue-600" />
                </label>
              </div>
            </div>
          </section>

          {/* VARIANTS */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
              <div>
                <h2 className="font-semibold text-gray-950">Product Variants</h2>
                <p className="text-sm text-gray-500">Manage colours, sizes, pricing, stock and images.</p>
              </div>

              <button
                type="button"
                onClick={() => append(createEmptyVariant())}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                <span className="text-lg leading-none">+</span>
                Add Variant
              </button>
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              {errors.variants?.root && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.variants.root.message}</p>
              )}

              {fields.map((field, index) => {
                const variant = watchedVariants?.[index]
                const variantErrors = errors.variants?.[index]

                return (
                  <div key={field.id} className="overflow-hidden rounded-2xl border border-gray-200">
                    {/* VARIANT HEADER */}
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-700 shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">Variant {index + 1}</h3>
                          <p className="text-xs text-gray-500">{variant?.label || 'New variant'}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-6 p-5">
                      {/* LABEL + SKU */}
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Variant Label <span className="text-red-500">*</span>
                          </label>
                          <input {...register(`variants.${index}.label`)} placeholder="e.g. Black" className={'inputClass'} />
                          {variantErrors?.label && (
                            <p className="mt-2 text-xs text-red-500">{variantErrors.label.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">SKU</label>
                          <input {...register(`variants.${index}.sku`)} placeholder="e.g. WATCH-BLK-001" className={'inputClass'} />
                          {variantErrors?.sku && <p className="mt-2 text-xs text-red-500">{variantErrors.sku.message}</p>}
                        </div>
                      </div>

                      {/* PRICE + STOCK */}
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Regular Price <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            {...register(`variants.${index}.price`, { valueAsNumber: true })}
                            className={'inputClass'}
                          />
                          {variantErrors?.price && (
                            <p className="mt-2 text-xs text-red-500">{variantErrors.price.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">Available Stock</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                            className={'inputClass'}
                          />
                          {variantErrors?.stock && (
                            <p className="mt-2 text-xs text-red-500">{variantErrors.stock.message}</p>
                          )}
                        </div>
                      </div>

                      {/* SALE SETTINGS */}
                      <div className="rounded-xl border border-gray-200 p-4">
                        <label className="flex cursor-pointer items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Enable Discount</p>
                            <p className="mt-1 text-xs text-gray-500">Offer a discounted price for this variant.</p>
                          </div>
                          <input type="checkbox" {...register(`variants.${index}.onSale`)} className="h-5 w-5 accent-blue-600" />
                        </label>

                        {variant?.onSale && (
                          <div className="mt-4 border-t border-gray-100 pt-4">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Sale Price</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              {...register(`variants.${index}.salePrice`, {
                                setValueAs: (value) => (value === '' || value == null ? undefined : Number(value)),
                              })}
                              placeholder="Enter discounted price"
                              className={'inputClass'}
                            />
                            {variantErrors?.salePrice && (
                              <p className="mt-2 text-xs text-red-500">{variantErrors.salePrice.message}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* IMAGES */}
                      <div>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">Variant Images</h4>
                            <p className="mt-1 text-xs text-gray-500">
                              Saved images stay unless you remove them. New uploads are marked &ldquo;New&rdquo;.
                            </p>
                          </div>
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            {variant?.images?.length || 0} images
                          </span>
                        </div>

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.7">
                              <path d="M12 16V4m0 0L7 9m5-5 5 5" />
                              <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">Click to add images</p>
                          <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP · Images are compressed automatically</p>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(event) => {
                              handleImageChange(index, event.target.files)
                              event.target.value = ''
                            }}
                          />
                        </label>

                        {variantErrors?.images && (
                          <p className="mt-2 text-xs text-red-500">
                            {(variantErrors.images as { message?: string }).message ?? 'Add at least one image'}
                          </p>
                        )}

                        {variant?.images?.length > 0 && (
                          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8">
                            {variant.images.map((image, imageIndex) => (
                              <ImagePreview
                                key={`${field.id}-${imageIndex}-${typeof image === 'string' ? image : image.name}`}
                                image={image}
                                onRemove={() => removeImage(index, imageIndex)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {compressionMessage && (
            <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
              {compressionMessage}
            </div>
          )}

          {mutation.isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {mutation.error.message}
            </div>
          )}

          {/* FOOTER */}
          <div className="flex flex-col-reverse justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:px-8">
            <p className="text-xs text-gray-500">
              {isDirty ? 'You have unsaved changes.' : 'No changes yet.'}
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={mutation.isPending || isSubmitting || !isDirty}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

const EditProductPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <EditProductContent />
    </Suspense>
  )
}

export default EditProductPage