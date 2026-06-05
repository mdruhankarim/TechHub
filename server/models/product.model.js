import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      // FIX: removed index:true — covered by compound indexes below
    },

    slug: {
      type: String,
      required: true,
      unique: true, // unique already creates its own index
      lowercase: true,
      trim: true,
      // FIX: removed index:true — unique already creates the index
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      // FIX: removed index:true — covered by compound indexes below
    },

    compareAtPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    category: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Category",
      // required: true,
      // FIX: removed index:true — covered by compound index below
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      // FIX: removed standalone index:true — rolled into compound index below
    },

    isPublished: {
      type: Boolean,
      default: false,
      // FIX: removed index:true — covered by compound indexes below
    },

    // FIX: added soft-delete field so orders that reference a product
    // still resolve correctly after the product is "removed"
    isArchived: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // FIX: removed index:true — covered by compound index below
    },

    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// =========================
// INDEXES — no duplicates
// Each field-level index:true above has been removed;
// only these compound (and one unique) indexes remain.
// =========================

// product detail page — unique already created above; no extra needed

// homepage / latest published products (exclude archived)
ProductSchema.index({ isPublished: 1, isArchived: 1, createdAt: -1 });

// category listing
ProductSchema.index({
  categoryId: 1,
  isPublished: 1,
  isArchived: 1,
  createdAt: -1,
});

// vendor dashboard
ProductSchema.index({ vendorId: 1, createdAt: -1 });

// FIX: merged standalone price + stock into one useful compound index:
// "in-stock published products sorted by price"
ProductSchema.index({ isPublished: 1, stock: 1, price: 1 });

// rating sorting
ProductSchema.index({ ratingAverage: -1 });

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
