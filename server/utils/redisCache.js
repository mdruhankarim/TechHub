import { redis } from "../config/redis.js";

export const invalidateProductCache = async (categoryId = null) => {
  const keys = ["all_products"];

  if (categoryId) {
    keys.push(`products:category:${categoryId}`);
  }

  await Promise.all(keys.map((k) => redis.del(k)));
};

export const invalidateCategoryCache = async () => {
  await redis.del("all_categories");
};
