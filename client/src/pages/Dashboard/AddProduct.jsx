import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Image as ImageIcon, Trash2, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
   AUTH — replace with your real auth hook
   e.g. const { user } = useAuth()
=================================================== */
const VENDOR_ID = "665f1a2b3c4d5e6f7a8b9c0d";

/* ===================================================
   SLUG HELPER
=================================================== */
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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
   RICH TEXT EDITOR
=================================================== */
function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("quill-custom-styles")) {
      const style = document.createElement("style");
      style.id = "quill-custom-styles";
      style.textContent = QUILL_STYLES;
      document.head.appendChild(style);
    }
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Write a detailed product description...",
      modules: { toolbar: TOOLBAR_OPTIONS, clipboard: { matchVisual: false } },
    });

    if (value) quillRef.current.root.innerHTML = value;

    quillRef.current.on("text-change", () => {
      onChange(quillRef.current.root.innerHTML);
    });
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div ref={editorRef} />
    </div>
  );
}

/* ===================================================
   MAIN PAGE
=================================================== */
export default function CreateProductPage() {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]); // File objects
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // Exact schema field names
      title: "",
      slug: "",
      category: "",
      price: "",
      compareAtPrice: "",
      stock: "",
      description: "",
      isPublished: false,
      isFeatured: false,
      isArchived: false,
    },
  });

  // Auto-generate slug from title unless user edited manually
  const titleValue = watch("title");
  useEffect(() => {
    if (!slugManuallyEdited) {
      setValue("slug", generateSlug(titleValue));
    }
  }, [titleValue, slugManuallyEdited]);

  /* ── IMAGE UPLOAD ── */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const updated = [...images, ...files];
    if (updated.length > 6) { alert("Maximum 6 images allowed"); return; }
    setImages(updated);
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  /* ── SUBMIT ── */
  const onSubmit = (data) => {
    const payload = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: Number(data.price),
      compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
      category: data.category,
      stock: Number(data.stock),
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      isArchived: data.isArchived,
      vendorId: VENDOR_ID,
      // Upload images to Cloudinary first → replace with [{ url, publicId }]
      images,
    };

    console.log("CREATE PRODUCT:", payload);
  };

  const emptySlots = Math.max(0, 5 - images.length);

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <main className="p-4 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-7xl">

          {/* ── PAGE HEADER ── */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                <span>Dashboard</span><span>/</span>
                <span>Products</span><span>/</span>
                <span className="font-medium text-gray-800">Add Product</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Add Product</h2>
              <p className="mt-1.5 text-sm text-gray-500">
                Create a new product listing for your store.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="h-11 rounded-xl px-6">
                Cancel
              </Button>
              <Button type="submit" className="h-11 rounded-xl bg-black px-6 hover:bg-black/90">
                Save Product
              </Button>
            </div>
          </div>

          {/* ══════════════════════════════════════
              CARD 1 — BASIC INFORMATION
              Fields: title, slug, category
          ══════════════════════════════════════ */}
          <Card className="mb-6 rounded-3xl shadow-none">
            <CardContent className="p-5 md:p-7">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <p className="mt-1 text-sm text-gray-500">Core product identity fields.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {/* title */}
                <div>
                  <Label className="mb-2 block">
                    Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="e.g. Apple MacBook Air M3"
                    className="h-12 rounded-2xl"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                  )}
                </div>

                {/* slug — auto-generated, user can override */}
                <div>
                  <Label className="mb-2 block">
                    Slug <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      {...register("slug", { required: "Slug is required" })}
                      placeholder="apple-macbook-air-m3"
                      className="h-12 rounded-2xl pr-20 font-mono text-sm"
                      onChange={(e) => {
                        setSlugManuallyEdited(true);
                        setValue("slug", e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSlugManuallyEdited(false);
                        setValue("slug", generateSlug(titleValue));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-200 transition"
                    >
                      <Sparkles className="h-3 w-3" />
                      Auto
                    </button>
                  </div>
                  {errors.slug && (
                    <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-400">
                    Auto-generated from title. Click Auto to reset.
                  </p>
                </div>

                {/* category */}
                <div>
                  <Label className="mb-2 block">Category</Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-12 rounded-2xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="laptops">Laptops</SelectItem>
                          <SelectItem value="phones">Phones</SelectItem>
                          <SelectItem value="tablets">Tablets</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ══════════════════════════════════════
              CARD 2 — PRICING & INVENTORY
              Fields: price, compareAtPrice, stock
          ══════════════════════════════════════ */}
          <Card className="mb-6 rounded-3xl shadow-none">
            <CardContent className="p-5 md:p-7">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set your price, sale price, and stock level.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* price */}
                <div>
                  <Label className="mb-2 block">
                    Price <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                    <Input
                      {...register("price", {
                        required: "Price is required",
                        min: { value: 0, message: "Price must be ≥ 0" },
                      })}
                      type="number" step="0.01" min="0" placeholder="0.00"
                      className="h-12 rounded-2xl pl-8"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
                  )}
                </div>

                {/* compareAtPrice */}
                <div>
                  <Label className="mb-2 block">Compare At Price</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                    <Input
                      {...register("compareAtPrice", {
                        min: { value: 0, message: "Must be ≥ 0" },
                      })}
                      type="number" step="0.01" min="0" placeholder="0.00"
                      className="h-12 rounded-2xl pl-8"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400">
                    Shown as strikethrough original price.
                  </p>
                </div>

                {/* stock */}
                <div>
                  <Label className="mb-2 block">
                    Stock <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    {...register("stock", {
                      required: "Stock is required",
                      min: { value: 0, message: "Stock must be ≥ 0" },
                    })}
                    type="number" min="0" placeholder="0"
                    className="h-12 rounded-2xl"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ══════════════════════════════════════
              CARD 3 — IMAGES
              Schema: [{ url, publicId }]
          ══════════════════════════════════════ */}
          <Card className="mb-6 rounded-3xl shadow-none">
            <CardContent className="p-5 md:p-7">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Product Images</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload up to 6 images. Stored as{" "}
                  <code className="rounded bg-gray-100 px-1 text-xs">{"{ url, publicId }"}</code>{" "}
                  after Cloudinary upload.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                {/* Upload trigger */}
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="group flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-[#fafafa] p-4 text-center transition hover:border-black"
                >
                  <Upload className="mb-3 h-8 w-8 text-gray-500 transition group-hover:text-black" />
                  <h4 className="font-medium">Upload Images</h4>
                  <p className="mt-2 text-xs text-gray-400">Drag & drop or browse</p>
                  <input
                    hidden multiple type="file" accept="image/*"
                    ref={fileInputRef} onChange={handleImageUpload}
                  />
                </div>

                {/* Previews */}
                {images.map((file, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-3xl border bg-white">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="h-[190px] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <div key={i} className="flex min-h-[190px] items-center justify-center rounded-3xl border bg-[#fafafa]">
                    <ImageIcon className="h-8 w-8 text-gray-300" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ══════════════════════════════════════
              CARD 4 — PRODUCT DETAILS
              Fields: description (rich text)
                      isPublished, isFeatured, isArchived
          ══════════════════════════════════════ */}
          <Card className="rounded-3xl shadow-none">
            <CardContent className="p-5 md:p-7">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Product Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Description and visibility settings.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* description — rich text */}
                <div>
                  <Label className="mb-3 block">Description</Label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <RichTextEditor value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>

                {/* Status flags */}
                <div className="flex flex-col gap-4">
                  <Label className="block">Status Flags</Label>

                  {/* isPublished */}
                  <div className="flex items-start gap-3">
                    <Controller
                      control={control}
                      name="isPublished"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium">Published</p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Product is visible to customers on the storefront.
                      </p>
                    </div>
                  </div>

                  {/* isFeatured */}
                  <div className="flex items-start gap-3">
                    <Controller
                      control={control}
                      name="isFeatured"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium">Featured</p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shown in homepage featured sections.
                      </p>
                    </div>
                  </div>

                  {/* isArchived */}
                  <div className="flex items-start gap-3">
                    <Controller
                      control={control}
                      name="isArchived"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium">Archived</p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Soft-delete — hidden from store but order references stay intact.
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
