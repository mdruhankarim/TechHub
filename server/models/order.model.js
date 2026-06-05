import mongoose from "mongoose";

// FIX: each line item in the order is now an embedded subdocument.
// A single productId per order is not viable for real e-commerce.
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    // price snapshotted at order time — never rely on the live product price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

// FIX: delivery address snapshotted at order time.
// If the user later edits/deletes their address, order history stays correct.
const addressSnapshotSchema = new mongoose.Schema(
  {
    address_line: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true, // unique already creates the index — no extra needed
    },

    // FIX: replaced single productId + product_details with an items array
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "An order must have at least one item.",
      },
    },

    // FIX: embedded address snapshot instead of a reference
    delivery_address: {
      type: addressSnapshotSchema,
      required: true,
    },

    paymentId: {
      type: String,
      default: null,
    },

    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    // FIX: added order_status — separate concern from payment
    order_status: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

    subTotalAmt: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmt: {
      type: Number,
      required: true,
      min: 0,
    },

    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// user's order history, newest first
orderSchema.index({ userId: 1, createdAt: -1 });

// FIX: removed redundant orderId index — unique:true above already covers it

// admin: filter by payment status
orderSchema.index({ payment_status: 1 });

// admin: filter by order status
orderSchema.index({ order_status: 1 });

// Note: productId is now inside the items array.
// MongoDB does not efficiently index nested array fields for equality
// lookups on a single element. If you need "orders containing product X",
// keep a top-level productIds array and index that, or use an aggregation.

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
