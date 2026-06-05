import { useGetProfile } from "@/hooks/user.query";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoutes = ({ children }) => {
  const setUser = useUserStore((state) => state.setUser);
  const { data, isLoading, isError } = useGetProfile();
  console.log(data);

  useEffect(() => {
    if (data?.user) {
      setUser(data?.user);
    } else {
      setUser(data);
    }
  }, [data, setUser]);

  if (isLoading) <div>....Loading</div>;

  if (!data) {
    <Navigate to={"/login"} replace />;
  }

  return children;
};
