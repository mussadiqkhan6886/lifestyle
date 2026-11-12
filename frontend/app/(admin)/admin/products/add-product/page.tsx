
"use client";

import { useEffect, useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
import { ProductFormValues, productSchema } from "@/lib/schemas/productSchema";
import Image from "next/image";
import { createProduct } from "@/server/product";
import { toast } from "sonner";
import { collections } from "@/lib/constants";
import { Suspense } from "react";
import GenerateDesc from "@/components/admin/GenerateDesc";

export default function CreateProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading product form...
        </div>
      }
    >
      <CreateProductForm />
    </Suspense>
  );
}

const createEmptyVariant = (): ProductFormValues["variants"][number] => ({
  label: "",
  sku: "",
  stock: 0,
  price: 0,
  onSale: false,
  salePrice: undefined,
  images: [],
});

const defaultValues: ProductFormValues = {
  name: "",
  slug: "",
  category: "",
  description: "",
  hotSeller: false,
  variants: [createEmptyVariant()],
};


function ImagePreview({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <div className="relative">
      {preview && (
        <Image
            width={100} height={100}
          src={preview}
          alt={file.name}
          className="h-24 w-24 rounded-lg border object-cover"
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
      >
        ×
      </button>

      <p className="mt-1 max-w-24 truncate text-xs text-gray-500">
        {file.name}
      </p>
    </div>
  );
}



function CreateProductForm() {
  const [compressionMessage, setCompressionMessage] = useState("");

  // React Hook Form
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({ resolver: zodResolver(productSchema), defaultValues});

  // Dynamic variants
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "variants",
  });

  // Watch variant values to display conditional fields and images
  const watchedVariants = useWatch({
    control,
    name: "variants",
  });

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createProduct,

    onSuccess: (data) => {
      toast.success(data.message || "Product created successfully!", {id: "p"});

      reset(defaultValues);
      setCompressionMessage("");
      queryClient.invalidateQueries({queryKey: ["products"]})
    },
    onError: (err) => {
        toast.error(err.message || "Something went wrong", {id: "p"})
    }
  });


  const handleImageChange = async (
    variantIndex: number,
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    // Check image types
    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      alert("Please select image files only.");
      return;
    }

    // Multer route in this example accepts a maximum of 30 files
    const existingImages =
      getValues(`variants.${variantIndex}.images`) || [];

    const totalImages = getValues("variants").reduce(
      (total, variant) => total + variant.images.length,
      0
    );

    if (totalImages + selectedFiles.length > 30) {
      toast.error("You can upload a maximum of 30 images.");
      return;
    }

    try {
      setCompressionMessage("Compressing images...");

      const compressedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
          });

          return new File([compressedFile], file.name, {
            type: compressedFile.type,
            lastModified: Date.now(),
          });
        })
      );

      setValue(
        `variants.${variantIndex}.images`,
        [...existingImages, ...compressedFiles],
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );

      setCompressionMessage("Images compressed successfully.");
    } catch (error) {
      console.error("Image compression error:", error);

      setCompressionMessage("Image compression failed.");
    }
  };


  const removeImage = (
    variantIndex: number,
    imageIndex: number
  ) => {
    const currentImages =
      getValues(`variants.${variantIndex}.images`) || [];

    const updatedImages = currentImages.filter(
      (_, index) => index !== imageIndex
    );

    setValue(
      `variants.${variantIndex}.images`,
      updatedImages,
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };


  const onSubmit = (values: ProductFormValues) => {
    const formData = new FormData();

    // Product details
    formData.append("name", values.name);
    formData.append("slug", values.slug || "");
    formData.append("category", values.category);
    formData.append("description", values.description);
    formData.append("hotSeller", String(values.hotSeller));

    // Remove image File objects from variant JSON.
    // Files will be sent separately.
    const variantsForBackend = values.variants.map(
      ({ images, ...variant }) => ({
        ...variant,
        sku: variant.sku || "",
        salePrice: variant.onSale
          ? variant.salePrice
          : null,
      })
    );

    formData.append(
      "variants",
      JSON.stringify(variantsForBackend)
    );

    // Append images and their corresponding variant indexes
    const variantIndices: number[] = [];

    values.variants.forEach((variant, variantIndex) => {
      variant.images.forEach((image) => {
        formData.append("images", image);

        variantIndices.push(variantIndex);
      });
    });

    formData.append(
      "variantIndices",
      JSON.stringify(variantIndices)
    );

    // Send to Express backend
    mutation.mutate(formData);
  };

  const productName = useWatch({
    control,
    name: "name",
  });

  const description = useWatch({
    control,
    name: "description",
  });
 
return (
  <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-6xl">

      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="font-medium text-gray-900">Create</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Create Product
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add a new product to your store and manage its variants.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          New product
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-7"
      >

        {/* PRODUCT INFORMATION */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3 3 8l9 5 9-5-9-5Z" />
                  <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
                </svg>
              </div>

              <div>
                <h2 className="font-semibold text-gray-950">
                  Product Information
                </h2>
                <p className="text-sm text-gray-500">
                  Basic details about your product.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">

            {/* PRODUCT NAME */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>

              <input
                {...register("name")}
                placeholder="e.g. Classic Leather Watch"
                className="inputClass"
              />

              {errors.name && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* SLUG */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Product Slug
              </label>

              <input
                {...register("slug")}
                placeholder="classic-leather-watch"
                className="inputClass"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Leave empty to generate from product name.
              </p>

              {errors.slug && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>

              <select
                {...register("category")}
                defaultValue=""
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="" disabled>
                  Select a category
                </option>

                {collections.map((item) => (
                  <option
                    key={item.title}
                    value={item.title.replaceAll(" ", "-").toLowerCase()}
                  >
                    {item.title}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="sm:col-span-2">
              <label className="mb-2 text-sm font-semibold text-gray-700 flex items-start gap-2">
                Product Description <span className="text-red-500">*</span> <GenerateDesc
                      productName={productName}
                      description={description}
                      onGenerated={(generatedDescription) => {
                        setValue("description", generatedDescription, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />
              </label>

              <textarea
                {...register("description")}
                rows={5}
                placeholder="Write a detailed description of your product..."
                className="inputClass"
              />

              {errors.description && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* HOT SELLER */}
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Featured / Hot Seller
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Highlight this product in your store.
                  </p>
                </div>

                <input
                  type="checkbox"
                  {...register("hotSeller")}
                  className="h-5 w-5 cursor-pointer accent-blue-600"
                />
              </label>
            </div>

          </div>
        </section>

        {/* VARIANTS */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="8" height="8" rx="2" />
                  <rect x="13" y="3" width="8" height="8" rx="2" />
                  <rect x="3" y="13" width="8" height="8" rx="2" />
                  <rect x="13" y="13" width="8" height="8" rx="2" />
                </svg>
              </div>

              <div>
                <h2 className="font-semibold text-gray-950">
                  Product Variants
                </h2>
                <p className="text-sm text-gray-500">
                  Manage sizes, colors, pricing and stock.
                </p>
              </div>
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
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {errors.variants.root.message}
              </p>
            )}

            {fields.map((field, index) => {
              const variant = watchedVariants?.[index];
              const variantErrors = errors.variants?.[index];

              return (
                <div
                  key={field.id}
                  className="overflow-hidden rounded-2xl border border-gray-200"
                >

                  {/* VARIANT HEADER */}
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-700 shadow-sm">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          Variant {index + 1}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {variant?.label || "New variant"}
                        </p>
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

                        <input
                          {...register(`variants.${index}.label`)}
                          placeholder="e.g. Black / Large"
                          className="inputClass"
                        />

                        {variantErrors?.label && (
                          <p className="mt-2 text-xs text-red-500">
                            {variantErrors.label.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          SKU
                        </label>

                        <input
                          {...register(`variants.${index}.sku`)}
                          placeholder="e.g. WATCH-BLK-001"
                          className="inputClass"
                        />

                        {variantErrors?.sku && (
                          <p className="mt-2 text-xs text-red-500">
                            {variantErrors.sku.message}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* PRICE + STOCK */}
                    <div className="grid gap-5 sm:grid-cols-2">

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Regular Price <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            {...register(`variants.${index}.price`, {
                              valueAsNumber: true,
                            })}
                            className="inputClass"
                          />
                        </div>

                        {variantErrors?.price && (
                          <p className="mt-2 text-xs text-red-500">
                            {variantErrors.price.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Available Stock
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="1"
                          {...register(`variants.${index}.stock`, {
                            valueAsNumber: true,
                          })}
                          className="inputClass"
                        />

                        {variantErrors?.stock && (
                          <p className="mt-2 text-xs text-red-500">
                            {variantErrors.stock.message}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* SALE SETTINGS */}
                    <div className="rounded-xl border border-gray-200 p-4">

                      <label className="flex cursor-pointer items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Enable Discount
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Offer a discounted price for this variant.
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          {...register(`variants.${index}.onSale`)}
                          className="h-5 w-5 accent-blue-600"
                        />
                      </label>

                      {variant?.onSale && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Sale Price
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            {...register(
                              `variants.${index}.salePrice`,
                              {
                                setValueAs: (value) =>
                                  value === "" ? undefined : Number(value),
                              }
                            )}
                            placeholder="Enter discounted price"
                            className="inputClass"
                          />

                          {variantErrors?.salePrice && (
                            <p className="mt-2 text-xs text-red-500">
                              {variantErrors.salePrice.message}
                            </p>
                          )}
                        </div>
                      )}

                    </div>

                    {/* IMAGE UPLOAD */}
                    <div>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800">
                            Variant Images
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            Upload images for this specific variant.
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

                        <p className="text-sm font-semibold text-gray-800">
                          Click to upload images
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, WEBP · Images are compressed automatically
                        </p>

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(event) => {
                            handleImageChange(index, event.target.files);
                            event.target.value = "";
                          }}
                        />
                      </label>

                      {/* IMAGE PREVIEWS */}
                      {variant?.images?.length > 0 && (
                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8">
                          {variant.images.map((file, imageIndex) => (
                            <ImagePreview
                              key={`${field.id}-${imageIndex}`}
                              file={file as File}
                              onRemove={() => removeImage(index, imageIndex)}
                            />
                          ))}
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </section>

        {/* UPLOAD STATUS */}
        {compressionMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
            {compressionMessage}
          </div>
        )}

        {/* SUBMISSION ERROR */}
        {mutation.isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {mutation.error.message}
          </div>
        )}

        {/* FORM FOOTER */}
        <div className="flex flex-col-reverse justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:px-8">
          <p className="text-xs text-gray-500">
            Please review your product details before publishing.
          </p>

          <button
            type="submit"
            disabled={mutation.isPending || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Creating Product...
              </>
            ) : (
              <>
                Create Product
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  </main>
);

}
