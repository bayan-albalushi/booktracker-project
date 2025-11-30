import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ==========================
// REGISTER ADMIN THUNK
// ==========================
export const adminRegisterThunk = createAsyncThunk(
  "admin/register",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:7500/adminRegister", formData);
      if (!res.data.ok) return thunkAPI.rejectWithValue(res.data.msg);
      return res.data.msg;
    } catch (err) {
      return thunkAPI.rejectWithValue("Server Error");
    }
  }
);

// ==========================
// LOGIN ADMIN THUNK
// ==========================
export const adminLoginThunk = createAsyncThunk(
  "admin/login",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:7500/adminLogin", formData);
      if (!res.data.login) return thunkAPI.rejectWithValue(res.data.msg);

      return res.data.admin; // return admin data
    } catch {
      return thunkAPI.rejectWithValue("Server Error");
    }
  }
);

// ==========================
// SLICE
// ==========================
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    msg: "",
    loading: false,
  },

  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.msg = "";
      localStorage.removeItem("admin");
    },
  },

  extraReducers: (builder) => {
    // REGISTER
    builder.addCase(adminRegisterThunk.pending, (state) => {
      state.loading = true;
      state.msg = "";
    });
    builder.addCase(adminRegisterThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.msg = action.payload;
    });
    builder.addCase(adminRegisterThunk.rejected, (state, action) => {
      state.loading = false;
      state.msg = action.payload;
    });

    // LOGIN
    builder.addCase(adminLoginThunk.pending, (state) => {
      state.loading = true;
      state.msg = "";
    });
    builder.addCase(adminLoginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.admin = action.payload;
      state.msg = "Welcome";
    });
    builder.addCase(adminLoginThunk.rejected, (state, action) => {
      state.loading = false;
      state.msg = action.payload;
    });
  },
});

export const { logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
