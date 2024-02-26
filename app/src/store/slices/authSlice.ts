import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "..";
import { AddOrUpdateUser, User } from "../../@types/user";
import { ROLE } from "../../@types/role";

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  exp: number;
}

interface AuthState {
  loading: boolean;
  errored: boolean;
  user: User;
}

const initialState: AuthState = {
  loading: false,
  errored: false,
  user: {
    firstName: "",
    lastName: "",
    picture: null,
    email: "",
    role: ROLE.AGENT,
    verified: false,
    properties: [],
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startAction: (state) => {
      state.loading = true;
      state.errored = false;
    },
    successAction: (state) => {
      state.loading = false;
      state.errored = false;
    },
    failedAction: (state) => {
      state.loading = false;
      state.errored = true;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = { ...action.payload };
    },
    logoutUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export default authSlice.reducer;
export const { setUser, logoutUser, startAction, successAction, failedAction } =
  authSlice.actions;

export const login =
  (
    userData: {
      email: string;
      password: string;
    },
    scb?: () => void,
    fcb?: () => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(startAction());
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        userData
      );
      const { access_token } = res.data;
      localStorage.setItem("auth-token", access_token);
      dispatch(successAction());
      if (scb) scb();
    } catch (error) {
      dispatch(failedAction());
      if (fcb) fcb();
    }
  };

export const logout =
  (scb?: () => void, fcb?: () => void): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(startAction());
      localStorage.removeItem("auth-token");
      axios.defaults.headers.common["Authorization"] = "";
      dispatch(successAction());
      dispatch(logoutUser());
      if (scb) scb();
    } catch (error) {
      dispatch(failedAction());
      console.error(error);
      if (fcb) fcb();
    }
  };

export const forgotPassword =
  (
    userData: {
      email: string;
    },
    scb?: () => void,
    fcb?: () => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(startAction());
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/recover`,
        userData
      );
      if (res) {
        dispatch(successAction());
        if (scb) scb();
      } else {
        dispatch(failedAction());
        if (fcb) fcb();
      }
    } catch (error) {
      dispatch(failedAction());
      console.error(error);
      if (fcb) fcb();
    }
  };

export const resetPassword =
  (
    data: {
      password: string;
      token: string;
    },
    scb?: () => void,
    fcb?: () => void
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(startAction());
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/reset/password`,
        data
      );
      if (res) {
        dispatch(successAction());
        if (scb) scb();
      } else {
        dispatch(failedAction());
        if (fcb) fcb();
      }
    } catch (error) {
      dispatch(failedAction());
      console.error(error);
      if (fcb) fcb();
    }
  };

export const validateToken =
  (token: string, scb?: () => void, fcb?: () => void): AppThunk =>
  async (dispatch) => {
    try {
      //dispatch(startAction());
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/validate/recover/token/${token}`
      );
      if (res?.data?.isValid) {
        //dispatch(successAction());
        if (scb) scb();
      } else {
        dispatch(failedAction());
        if (fcb) fcb();
      }
    } catch (error) {
      //dispatch(failedAction());
      console.error(error);
      if (fcb) fcb();
    }
  };

export const verifyAccount =
  (token: string, scb?: () => void, fcb?: () => void): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(startAction());
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/verify/${token}`
      );
      if (res) {
        dispatch(successAction());
        if (scb) scb();
      } else {
        dispatch(failedAction());
        if (fcb) fcb();
      }
    } catch (error) {
      dispatch(failedAction());
      console.error(error);
      if (fcb) fcb();
    }
  };

export const getUserInfo =
  (scb?: () => void, fcb?: () => void): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(startAction());
      const res = await axios.get<User>(
        `${process.env.REACT_APP_API_URL}/auth`
      );
      if (res?.data) {
        dispatch(setUser(res.data));
        dispatch(successAction());
        if (scb) scb();
      } else {
        dispatch(failedAction());
        if (fcb) fcb();
      }
    } catch (error) {
      dispatch(failedAction());
      console.error(error);
      if (fcb) fcb();
    }
  };

export const editProfile =
  (data: AddOrUpdateUser, scb?: () => void, fcb?: () => void): AppThunk =>
  async (dispatch) => {
    try {
      const res = await axios.put<User>(
        `${process.env.REACT_APP_API_URL}/users`,
        data
      );
      if (res.data) {
        dispatch(setUser(res.data));
        if (scb) scb();
      } else {
        if (fcb) fcb();
      }
    } catch (error) {
      console.error(error);
      if (fcb) fcb();
    }
  };
