import { getUser, loginUser, registerUser } from "@/api/user.api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useUpdateProfile = () => {
  return useMutation({});
};

export const useGetProfile = (enabled = true) => {
  return useQuery({
    queryFn: getUser,
    enabled,
    queryKey: ["getUser"],
    retry: false,
  });
};
