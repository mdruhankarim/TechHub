// PATH: src/components/product/ProductCard.jsx
// FILE: ProductCard.jsx

import { Link } from "react-router-dom";
import ProductBadge from "./ProductBadge";
import ProductActions from "./ProductActions";
import AddToCartButton from "./AddToCartButton";
import ProductRating from "./ProductRating";
import ProductPrice from "./ProductPrice";

const ProductCard = ({
  image,
  title,
  subtitle,
  price,
  oldPrice,
  rating,
  reviews,
  stock,
  badge,
  isWishlisted,
  outOfStock,
  productId,
  slug,
  priority = false,
}) => {
  return (
    <div className="group relative w-full rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md overflow-hidden flex flex-col">
      {/* ↑ flex flex-col added */}

      <ProductBadge badge={badge} isWishlisted={isWishlisted} />

      <Link href={`/products/${slug}`} className="block">
        <div className="relative mb-3 flex h-[120px] sm:h-[140px] md:h-[150px] items-center justify-center overflow-hidden">
          <img
            src={image}
            alt={title}
            width={300}
            height={300}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="max-h-[100px] sm:max-h-[120px] md:max-h-[130px] w-auto max-w-full object-contain transition-all duration-500 group-hover:scale-105"
          />
          {!outOfStock && <ProductActions slug={slug} />}
        </div>
      </Link>

      {/* flex-1 pushes button to bottom regardless of content height */}
      <div className="flex flex-col flex-1 gap-2">
        <Link href={`/products/${slug}`} className="block">
          <h3 className="line-clamp-2 text-sm sm:text-[15px] font-semibold leading-snug text-gray-900 break-words hover:text-gray-600 transition-colors">
            {title}
          </h3>
          <p className="mt-1 line-clamp-1 text-[11px] sm:text-xs text-gray-500">
            {subtitle}
          </p>
        </Link>

        <ProductRating rating={rating} reviews={reviews} />

        <ProductPrice price={price} oldPrice={oldPrice} stock={stock} />

        {/* mt-auto always pins button to the bottom */}
        <div className="mt-auto">
          <AddToCartButton
            outOfStock={outOfStock}
            productId={productId}
            title={title}
            price={price}
            image={image}
            stock={stock}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
