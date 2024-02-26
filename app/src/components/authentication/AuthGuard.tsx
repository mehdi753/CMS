/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import jwtDecode from "jwt-decode";
import { UserPayload } from "../../store/slices/authSlice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useEffect, useState } from "react";
import { Loading } from "../misc/Loading";

export function AuthGuard() {
  const location = useLocation();
  const auth = useAuth();
  const { user: storeUser } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = localStorage.getItem("auth-token");
    if (access_token) {
      const user: UserPayload = jwtDecode(access_token);
      if (user?.exp && user?.exp * 1000 < Date.now()) {
        auth.signout(() => {
          navigate("/", { state: { from: location }, replace: true });
        });
      }
      if (!storeUser?.email) {
        auth.getUserInfo(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } else {
      navigate("/", { state: { from: location }, replace: true });
    }
  }, []);

  return !loading ? <Outlet /> : <Loading />;
}
