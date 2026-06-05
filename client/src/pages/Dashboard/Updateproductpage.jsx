import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useForm, Controller } from "react-hook-form";

import Quill from "quill";

import "quill/dist/quill.snow.css";

import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ===================================================
   CONFIG — swap this for your real product ID source
   e.g. from router: const { id } = useParams()
=================================================== */

const PRODUCT_ID = "123";
const API_BASE = "http://localhost:5000/api";

/* ===================================================
   QUILL SETUP
=================================================== */

const icons = Quill.import("ui/icons");
icons.bold = `<svg viewBox="0 0 18 18"><path d="M5,4h5a3,3 0 0,1 0,6H5z M5,10h6a3,3 0 0,1 0,6H5z"></path></svg>`;

const TOOLBAR_OPTIONS = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image", "video"],
  ["clean"],
];

const QUILL_STYLES = `
  .ql-container { min-height: 320px; font-size: 14px; border: none !important; }
  .ql-toolbar { border: none !important; border-bottom: 1px solid #e5e7eb !important; background: #f9fafb; border-radius: 24px 24px 0 0; }
  .ql-editor { min-height: 320px; padding: 16px; }
  .ql-editor.ql-blank::before { font-style: normal; color: #9ca3af; }
`;

/* ===================================================
   SKELETON COMPONENTS
=================================================== */

function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gray-200 ${className}`}
    />
  );
}

function SkeletonCard({ children }) {
  return (
    <Card className="mb-6 rounded-3xl shadow-none">
      <CardContent className="p-5 md:p-7">{children}</CardContent>
    </Card>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header skeleton */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-24 rounded-xl" />
              <Skeleton className="h-11 w-36 rounded-xl" />
            </div>
          </div>

          {/* Basic Information skeleton */}
          <SkeletonCard>
            <div className="mb-6 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-52" />
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-12" />
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-28" />
            </div>
          </SkeletonCard>

          {/* Images skeleton */}
          <SkeletonCard>
            <div className="mb-6 space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-52" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="min-h-[190px] rounded-3xl" />
              ))}
            </div>
          </SkeletonCard>

          {/* Details skeleton */}
          <SkeletonCard>
            <div className="mb-6 space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-60" />
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="min-h-[380px] rounded-3xl" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
                <Skeleton className="h-11 w-36 rounded-xl" />
                <div className="mt-6 flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-52" />
                  </div>
                </div>
              </div>
            </div>
          </SkeletonCard>

        </div>
      </main>
    </div>
  );
}

/* ===================================================
   RICH TEXT EDITOR
=================================================== */

function RichTextEditor({ value, onChange, readyValue }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // Inject styles once
  useEffect(() => {
    if (!document.getElementById("quill-custom-styles")) {
      const style = document.createElement("style");
      style.id = "quill-custom-styles";
      style.textContent = QUILL_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  // Init Quill once
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Write professional product description...",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        clipboard: { matchVisual: false },
      },
    });

    quillRef.current.on("text-change", () => {
      onChange(quillRef.current.root.innerHTML);
    });
  }, [onChange]);

  // Set fetched value after Quill is ready
  useEffect(() => {
    if (quillRef.current && readyValue) {
      quillRef.current.root.innerHTML = readyValue;
    }
  }, [readyValue]);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div ref={editorRef} />
    </div>
  );
}

/* ===================================================
   EXISTING IMAGE (URL string from backend)
=================================================== */

function ExistingImageCard({ url, onRemove }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border bg-white">
      <img
        src={url}
        alt="product"
        className="h-[190px] w-full object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ===================================================
   UPDATE PRODUCT PAGE
=================================================== */

export default function UpdateProductPage() {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Existing images from backend (URL strings)
  const [existingImages, setExistingImages] = useState([]);
  // Newly uploaded images (File objects)
  const [newImages, setNewImages] = useState([]);

  const [features, setFeatures] = useState([""]);

  // We keep the description separately so we can
  // push it into Quill after it's ready
  const [fetchedDescription, setFetchedDescription] = useState("");

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      productName: "",
      sku: "",
      category: "",
      brand: "",
      shortDescription: "",
      description: "",
      isActive: true,
    },
  });

  /* ===================================================
     FETCH PRODUCT
  =================================================== */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE}/products/${PRODUCT_ID}`
        );

        if (!response.ok) throw new Error("Failed to fetch product");

        const product = await response.json();

        // Populate form fields
        reset({
          productName: product.productName ?? "",
          sku: product.sku ?? "",
          category: product.category ?? "",
          brand: product.brand ?? "",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          isActive: product.isActive ?? true,
        });

        setFeatures(
          product.features?.length ? product.features : [""]
        );

        setExistingImages(product.images ?? []);

        // Push description into Quill after it mounts
        setFetchedDescription(product.description ?? "");
      } catch (err) {
        console.error(err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [reset]);

  /* ===================================================
     IMAGE UPLOAD
  =================================================== */

  const totalImages = existingImages.length + newImages.length;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (totalImages + files.length > 6) {
      alert("Maximum 6 images allowed");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ===================================================
     FEATURES
  =================================================== */

  const addFeature = () => setFeatures([...features, ""]);

  const updateFeature = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  /* ===================================================
     SUBMIT
  =================================================== */

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        features,
        existingImages,   // URLs still kept
        newImages,        // File objects to upload
      };

      console.log("UPDATE PRODUCT DATA:", payload);

      alert("Product Updated Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  /* ===================================================
     RENDER STATES
  =================================================== */

  if (loading) return <PageSkeleton />;

  if (fetchError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6fa]">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-red-500">
            Failed to load product
          </p>
          <p className="mt-2 text-sm text-gray-400">{fetchError}</p>
          <Button
            className="mt-6 h-11 rounded-xl bg-black px-6"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const emptySlots = Math.max(0, 5 - totalImages);

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <main className="p-4 md:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-7xl"
        >
          {/* ===================================================
              PAGE HEADER
          =================================================== */}

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                <span>Dashboard</span>
                <span>/</span>
                <span>Products</span>
                <span>/</span>
                <span className="text-black">Update Product</span>
              </div>

              <h2 className="text-3xl font-bold">Update Product</h2>

              <p className="mt-2 text-sm text-gray-500">
                Edit and save changes to your product listing.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl px-6"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="h-11 rounded-xl bg-black px-6 hover:bg-black/90"
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* ===================================================
              BASIC INFORMATION
          =================================================== */}

          <Card className="mb-6 rounded-3xl shadow-none">
            <CardContent className="p-5 md:p-7">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <p className="mt-1 text-sm text-gray-500">Edit product information.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <Label className="mb-2 block">Product Name *</Label>
                  <Input
                    {...register("productName")}
                    placeholder="Apple MacBook Air M2"
                    className="h-12 rounded-2xl"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">SKU *</Label>
                  <Input
                    {...register("sku")}
                    placeholder="MBP-M2-2024"
                    className="h-12 rounded-2xl"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Category *</Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 rounded-2xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="laptops">Laptops</SelectItem>
                          <SelectItem value="phones">Phones</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Brand</Label>
                  <Input
                    {...register("brand")}
                    placeholder="Apple"
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>

              <div className="mt-5">
                <Label className="mb-2 block">Short Description</Label>
                <Textarea
                  {...register("shortDescription")}
                  rows={4}
                  placeholder="Powerful laptop with M2 chip..."
                  className="resize-none rounded-2xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* ===================================================
              PRODUCT IMAGES
          =================================================== */}

          <Card className="mb-6 rounded-3xl shadow-none">
            <CardContent className="p-5 md:p-7">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Product Images</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload up to 6 product images.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                {/* Upload Box */}
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="group flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-[#fafafa] p-4 text-center transition hover:border-black"
                >
                  <Upload className="mb-3 h-8 w-8 text-gray-500 transition group-hover:text-black" />
                  <h4 className="font-medium">Upload Images</h4>
                  <p className="mt-2 text-xs text-gray-400">Drag & drop or browse</p>
                  <input
                    hidden
                    multiple
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Existing images from backend */}
                {existingImages.map((url, index) => (
                  <ExistingImageCard
                    key={`existing-${index}`}
                    url={url}
                    onRemove={() => removeExistingImage(index)}
                  />
                ))}

                {/* Newly uploaded images */}
                {newImages.map((file, index) => (
                  <div
                    key={`new-${index}`}
                    className="group relative overflow-hidden rounded-3xl border bg-white"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="h-[190px] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Empty placeholders */}
                {Array.from({ length: emptySlots }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="flex min-h-[190px] items-center justify-center rounded-3xl border bg-[#fafafa]"
                  >
                    <ImageIcon className="h-8 w-8 text-gray-300" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ===================================================
              PRODUCT DETAILS
          =================================================== */}

          <Card className="rounded-3xl shadow-none">
            <CardContent className="p-5 md:p-7">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Product Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Professional product description and features.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Description */}
                <div>
                  <Label className="mb-3 block">Description *</Label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        readyValue={fetchedDescription}
                      />
                    )}
                  />
                </div>

                {/* Features */}
                <div>
                  <Label className="mb-3 block">Key Features</Label>

                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="e.g. Liquid Retina Display"
                          className="h-12 rounded-2xl"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 rounded-xl"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addFeature}
                    className="mt-4 h-11 rounded-xl"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>

                  {/* Active toggle */}
                  <div className="mt-8 flex items-start gap-3">
                    <Controller
                      control={control}
                      name="isActive"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium">This product is active</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Product will be visible to customers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
