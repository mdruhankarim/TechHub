import api from "./Axios";

export const getProducsts = async (params) => {
  const res = await api.get("/products", { params });
  return res.data;
};
