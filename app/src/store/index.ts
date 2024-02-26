import { Action, AnyAction, configureStore } from "@reduxjs/toolkit";
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import authReducer from "./slices/authSlice";
import propertiesReducer from "./slices/propertiesSlice";
import usersReducer from "./slices/usersSlice";
import websitesReducer from "./slices/websitesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
    users: usersReducer,
    websites: websitesReducer,
  },
  middleware: [thunk],
});

export type AppState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, AppState, unknown, Action>;
export type AppDispatch = ThunkDispatch<AppState, any, AnyAction>;

export default store;
