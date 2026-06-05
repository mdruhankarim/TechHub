import { useProducts } from "@/hooks/useProducts";
import React, { useState } from "react";

const ProductPage = () => {
  // ১. ডাইনামিক ফিল্টারগুলোর জন্য স্টেট ডিফাইন করো
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState(""); // পেজিনেশনের জন্য

  // ২. ফিল্টার অবজেক্টটি হুকে পাস করো
  const { data, isLoading, isError, error } = useProducts({
    limit: 10,       // প্রতি পেজে ১০টি করে প্রোডাক্ট চাই
    category: category || undefined, // খালি থাকলে undefined যাতে ইউআরএল-এ না যায়
    search: search || undefined,
    cursor: cursor || undefined,
  });

  if (isLoading) return <div className="p-5 text-white">Loading products...</div>;
  if (isError) return <div className="p-5 text-red-500">Error: {error?.message}</div>;

  // ব্যাকএন্ড রেসপন্স থেকে প্রোডাক্টস এবং নেক্সট কার্সর আলাদা করা
  const products = data?.data?.products || [];
  const nextCursor = data?.data?.nextCursor;
  const hasMore = data?.data?.hasMore;

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Product Store</h1>

      {/* 🛠️ ফিল্টার সেকশন */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {/* সার্চ বক্স */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCursor(""); // নতুন সার্চে কার্সর রিসেট হবে
          }}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-sm"
        />

        {/* ক্যাটাগরি ড্রপডাউন */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCursor(""); // ক্যাটাগরি চেঞ্জে কার্সর রিসেট হবে
          }}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 text-sm"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="shoes">Shoes</option>
        </select>
      </div>

      {/* 📦 প্রোডাক্ট গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {products.map((product) => (
          <div key={product._id} className="bg-slate-800 p-4 border border-slate-700 rounded-xl hover:border-slate-600 transition-all">
            <h3 className="font-semibold text-lg">{product.title}</h3>
            <p className="text-indigo-400 mt-2 font-medium">${product.price}</p>
            <div className="text-xs text-slate-400 mt-1">Stock: {product.stock}</div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-3 text-center text-slate-400 py-10">No products found!</div>
        )}
      </div>

      {/* ⏭️ পেজিনেশন কন্ট্রোল (Load More) */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            if (nextCursor) setCursor(nextCursor); // ক্লিক করলে পরবর্তী পেজের আইডি কার্সরে সেট হবে
          }}
          disabled={!hasMore}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all ${
            hasMore
              ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
          }`}
        >
          {hasMore ? "Load More Products" : "No More Products"}
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
