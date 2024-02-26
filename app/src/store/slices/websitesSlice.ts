import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Website } from "../../@types/website";
import { PaginatedQuery, PaginatedResult, State } from "../../@types/misc";
import { WebsiteQueryFilters } from "../../@types/filters";
import axios from "axios";
import { AppThunk } from "..";

interface CustomState {
  website: Website | null;
  editedWebsite: Website | null;
  editMode: boolean;
}

const initialState: State & CustomState = {
  loading: false,
  errored: false,
  website: null,
  editMode: false,
  editedWebsite: null,
};

const websiteSlice = createSlice({
  name: "website",
  initialState,
  reducers: {
    setWebsite: (state, action: PayloadAction<Website>) => {
      state.website = { ...action.payload };
      if (state.editedWebsite?._id !== action.payload._id) {
        state.editedWebsite = { ...action.payload };
        state.editMode = false;
      }
    },
    setEditedWebsite: (state, action: PayloadAction<Website>) => {
      state.editedWebsite = { ...action.payload };
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.editMode = action.payload;
    },
    startGetWebsite: (state) => {
      state.loading = true;
      state.errored = false;
      state.website = null;
    },
    successGetWebsite: (state, action: PayloadAction<Website>) => {
      state.loading = false;
      state.errored = false;
      state.website = { ...action.payload };
      state.editedWebsite = { ...action.payload };
    },
    failGetWebsite: (state) => {
      state.loading = false;
      state.errored = true;
      state.website = null;
    },
    startUpdateWebsite: (state) => {
      state.loading = true;
      state.errored = false;
    },
    successUpdateWebsite: (state, action: PayloadAction<Website>) => {
      state.loading = false;
      state.errored = false;
      state.website = { ...action.payload };
      state.editedWebsite = { ...action.payload };
      state.editMode = false;
    },
    failUpdateWebsite: (state) => {
      state.loading = false;
      state.errored = true;
    },
  },
});

export const {
  setWebsite,
  setEditMode,
  setEditedWebsite,
  startGetWebsite,
  successGetWebsite,
  failGetWebsite,
  startUpdateWebsite,
  successUpdateWebsite,
  failUpdateWebsite,
} = websiteSlice.actions;

export default websiteSlice.reducer;

export const getWebsites = async (
  filters: PaginatedQuery<WebsiteQueryFilters>,
  scb: (v: PaginatedResult<Website>) => void,
  fcb: (v: PaginatedResult<Website>) => void
): Promise<void> => {
  try {
    const res = await axios.post<PaginatedResult<Website>>(
      `${process.env.REACT_APP_API_URL}/websites`,
      filters
    );
    scb(res.data);
  } catch (error) {
    console.error(error);
    fcb({
      total: 0,
      offset: 1,
      limit: 10,
      list: [],
    });
  }
};

export const setWebsiteAction =
  (website: Website, cb?: () => void): AppThunk =>
  (dispatch) => {
    dispatch(setWebsite(website));
    if (cb) return cb();
  };

export const setEditedWebsiteAction =
  (website: Website, cb?: () => void): AppThunk =>
  (dispatch) => {
    dispatch(setEditedWebsite(website));
    if (cb) return cb();
  };

export const setEditModeAction =
  (mode: boolean, cb?: () => void): AppThunk =>
  (dispatch) => {
    dispatch(setEditMode(mode));
    if (cb) return cb();
  };

export const getWebsite =
  (id: string, scb?: (v: Website) => void, fcb?: () => void): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(startGetWebsite());
      const res = await axios.get<Website>(
        `${process.env.REACT_APP_API_URL}/websites/${id}`
      );
      if (res.data) {
        dispatch(successGetWebsite(res.data));
        if (scb) scb(res.data);
      } else {
        dispatch(failGetWebsite());
        if (fcb) fcb();
      }
    } catch (err) {
      console.error(err);
      dispatch(failGetWebsite());
      if (fcb) fcb();
    }
  };

export const updateWebsite =
  (data: Website, scb?: () => void, fcb?: () => void): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(startUpdateWebsite());
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/websites`,
        data
      );
      if (res) {
        dispatch(successUpdateWebsite(data));
        if (scb) scb();
      } else {
        dispatch(failUpdateWebsite());
        if (fcb) fcb();
      }
    } catch (err) {
      console.error(err);
      dispatch(failUpdateWebsite());
      if (fcb) fcb();
    }
  };
