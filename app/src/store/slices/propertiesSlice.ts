import { createSlice } from "@reduxjs/toolkit";
import { AddOrUpdateProperty, Property } from "../../@types/property";
import { PaginatedQuery, PaginatedResult } from "../../@types/misc";
import axios from "axios";
import { PropertyQueryFilters } from "../../@types/filters";

export const propertiesSlice = createSlice({
  name: "properties",
  initialState: {},
  reducers: {},
});

export default propertiesSlice.reducer;

export const getProperties = async (
  filters: PaginatedQuery<PropertyQueryFilters>,
  scb: (v: PaginatedResult<Property>) => void,
  fcb: (v: PaginatedResult<Property>) => void
) => {
  try {
    const res = await axios.post<PaginatedResult<Property>>(
      `${process.env.REACT_APP_API_URL}/properties`,
      filters
    );

    scb(res.data);
  } catch (error) {
    console.error(error);
    fcb({ total: 0, offset: 1, limit: 10, list: [] });
  }
};

export const editProperty = async (
  data: AddOrUpdateProperty,
  scb?: () => void,
  fcb?: () => void
) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/properties`,
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

export const deleteProperty = async (
  id: string,
  scb?: () => void,
  fcb?: () => void
) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/properties/${id}`
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

export const addProperty = async (
  data: AddOrUpdateProperty,
  scb?: () => void,
  fcb?: () => void
) => {
  try {
    const res = await axios.post<Property>(
      `${process.env.REACT_APP_API_URL}/properties/add`,
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

export const assignUser = async (
  data: { propertyId: string; email: string; subscribe: boolean },
  scb?: () => void,
  fcb?: () => void
) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/properties/subscribe`,
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
