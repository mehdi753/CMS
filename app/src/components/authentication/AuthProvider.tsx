import React from "react";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  validateToken,
  verifyAccount,
  getUserInfo as getUserInfoAction,
} from "../../store/slices/authSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { AuthContext } from "../../hooks/useAuth";
import { useAppSelector } from "../../hooks/useAppSelector";
import { ROLE } from "../../@types/role";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { loading, errored, user } = useAppSelector((state) => state.auth);

  const getUserInfo = (scb?: () => void, fcb?: () => void) =>
    dispatch(getUserInfoAction(scb, fcb));

  const signin = (
    newUser: { email: string; password: string },
    scb?: () => void,
    fcb?: () => void
  ) => {
    dispatch(login(newUser, scb, fcb));
  };

  const signout = (scb?: () => void, fcb?: () => void) => {
    return dispatch(logout(scb, fcb));
  };

  const forgot = (
    newUser: { email: string },
    scb?: () => void,
    fcb?: () => void
  ) => {
    dispatch(forgotPassword(newUser, scb, fcb));
  };

  const reset = (
    data: { password: string; token: string },
    scb?: () => void,
    fcb?: () => void
  ) => {
    dispatch(resetPassword(data, scb, fcb));
  };

  const validate = (token: string, scb?: () => void, fcb?: () => void) => {
    dispatch(validateToken(token, scb, fcb));
  };

  const verify = (token: string, scb?: () => void, fcb?: () => void) => {
    dispatch(verifyAccount(token, scb, fcb));
  };

  function authorize<T>(roles: ROLE[], scb: () => T, fcb: () => T): T {
    if (roles.includes(user.role)) {
      return scb();
    } else {
      return fcb();
    }
  }

  const value = {
    loading,
    errored,
    signin,
    signout,
    forgot,
    reset,
    validate,
    getUserInfo,
    verify,
    authorize,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
