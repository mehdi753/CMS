import { Navigate, Outlet } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { UserPayload } from "../../store/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";

export function LoginGuard() {
  const auth = useAuth();
  const access_token = localStorage.getItem("auth-token");
  if (access_token) {
    const user: UserPayload = jwtDecode(access_token);
    if (user?.exp * 1000 > Date.now()) {
      return <Navigate to="/dashboard" />;
    } else {
      auth.signout();
    }
  }

  return <Outlet />;
}
