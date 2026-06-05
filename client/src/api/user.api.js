import api from "./Axios";

export const registerUser = async (data) => {
  const res = await api.post("users/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/users/login", data);
  return res.data;
};
