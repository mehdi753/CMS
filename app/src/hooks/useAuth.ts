import React from "react";
import { ROLE } from "../@types/role";

interface AuthContextType {
  loading: boolean;
  errored: boolean;
  getUserInfo: (scb?: () => void, fcb?: () => void) => void;
  signin: (
    user: { email: string; password: string },
    scb?: () => void,
    fcb?: () => void
  ) => void;
  signout: (scb?: () => void, fcb?: () => void) => void;
  forgot: (user: { email: string }, scb?: () => void, fcb?: () => void) => void;
  reset: (
    data: { token: string; password: string },
    scb?: () => void,
    fcb?: () => void
  ) => void;
  validate: (token: string, scb?: () => void, fcb?: () => void) => void;
  verify: (token: string, scb?: () => void, fcb?: () => void) => void;
  authorize: <T>(roles: ROLE[], scb: () => T, fcb: () => T) => T;
}
export const AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth() {
  return React.useContext(AuthContext);
}
