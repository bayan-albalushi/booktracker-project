import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const savedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const userLoginThunk = createAsyncThunk(
  "user/login",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(
        "https://booktracker-project.onrender.com/userLogin",
        data
      );

      if (res.data.login === true) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Server Error");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: savedUser,
    msg: "",
    role: "user",
  },

  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.msg = "";
      localStorage.removeItem("user");
    },

    // ✅ ADD THIS
    clearUserMsg: (state) => {
      state.msg = "";
    },
  },

  extraReducers: (builder) => {
    builder.addCase(userLoginThunk.pending, (state) => {
      state.msg = "";
    });

    builder.addCase(userLoginThunk.fulfilled, (state, action) => {
      state.msg = action.payload.msg;   // could be "Welcome"
      state.user = action.payload.user;
      state.role = "user";
    });

    builder.addCase(userLoginThunk.rejected, (state, action) => {
      state.msg = action.payload || "Login failed";
    });
  },
});

export const { logoutUser, clearUserMsg } = userSlice.actions;
export default userSlice.reducer;
