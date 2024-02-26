import { AddOrUpdateUser, User } from "../../@types/user";
import { PaginatedQuery, PaginatedResult } from "../../@types/misc";
import axios from "axios";
import { UserQueryFilters } from "../../@types/filters";
import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: "users",
  initialState: {},
  reducers: {},
});

export default usersSlice.reducer;

export const getUsers = async (
  filters: PaginatedQuery<UserQueryFilters>,
  scb: (data: PaginatedResult<User>) => void,
  fcb: (data: PaginatedResult<User>) => void
) => {
  try {
    const res = await axios.post<PaginatedResult<User>>(
      `${process.env.REACT_APP_API_URL}/users`,
      filters
    );

    scb(res.data);
  } catch (error) {
    console.error(error);
    fcb({ total: 0, offset: 1, limit: 10, list: [] });
  }
};

export const editUser = async (
  data: AddOrUpdateUser,
  scb?: () => void,
  fcb?: () => void
) => {
  try {
    const res = await axios.put<User>(
      `${process.env.REACT_APP_API_URL}/users`,
      data
    );
    if (res.data) {
      if (scb) scb();
    } else {
      if (fcb) fcb();
    }
  } catch (error) {
    console.error(error);
    if (fcb) fcb();
  }
};

export const deleteUser = async (
  id: string,
  scb?: () => void,
  fcb?: () => void
) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/users/${id}`
    );
    if (res) {
      if (scb) scb();
    } else {
      if (fcb) fcb();
    }
  } catch (error) {
    console.error(error);
    if (fcb) fcb();
  }
};

export const addUser = async (
  data: AddOrUpdateUser,
  scb?: () => void,
  fcb?: () => void
) => {
  try {
    const res = await axios.post<User>(
      `${process.env.REACT_APP_API_URL}/users/add`,
      data
    );
    if (res) {
      if (scb) scb();
    } else {
      if (fcb) fcb();
    }
  } catch (error) {
    console.error(error);
    if (fcb) fcb();
  }
};

export const searchUsers = async (
  filters: PaginatedQuery<UserQueryFilters>
): Promise<PaginatedResult<User>> => {
  try {
    const res = await axios.post<PaginatedResult<User>>(
      `${process.env.REACT_APP_API_URL}/users`,
      filters
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return {
      offset: 1,
      limit: 10,
      list: [],
      total: 0,
    };
  }
};
