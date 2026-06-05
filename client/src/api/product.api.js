import api from "./Axios";

export const getProducsts = async (params) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/products/categories");
  return res.data;
};
