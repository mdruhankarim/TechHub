import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      // FIX: removed index:true — unique already creates the index
    },

    slug: {
      type: String,
      unique: true,
      // FIX: removed index:true — unique already creates the index
      lowercase: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    // FIX: optional parent for subcategory support.
    // null = top-level category. Retrofitting a hierarchy later is painful;
    // this costs nothing now and gives you the option.
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true, // useful: "give me all subcategories of X"
    },
  },
  { timestamps: true, versionKey: false },
);

// fast category listing, newest first
categorySchema.index({ createdAt: -1 });

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
