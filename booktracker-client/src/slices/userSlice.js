import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const userLoginThunk = createAsyncThunk(
  "user/login",
  async (data) => {
    const res = await axios.post("http://localhost:7500/userLogin", data);

    // ⭐⭐ حفظ بيانات المستخدم إذا كان تسجيل الدخول ناجح ⭐⭐
    if (res.data.login === true) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    msg: null,
    role: "user",
  },

  extraReducers: (builder) => {
    builder.addCase(userLoginThunk.fulfilled, (state, action) => {
      state.msg = action.payload.msg;
      state.user = action.payload.user;
      state.role = "user";
    });
  },
});

export default userSlice.reducer;
