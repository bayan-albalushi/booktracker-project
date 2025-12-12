import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ⭐ تحميل المستخدم المحفوظ إذا موجود
const savedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const userLoginThunk = createAsyncThunk(
  "user/login",
  async (data) => {
    const res = await axios.post("http://localhost:7500/userLogin", data);

    if (res.data.login === true) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: savedUser,   // ⭐⭐⭐ هنا أهم إصلاح
    msg: null,
    role: "user",
  },

  reducers: {
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(userLoginThunk.fulfilled, (state, action) => {
      state.msg = action.payload.msg;
      state.user = action.payload.user;
      state.role = "user";
    });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
