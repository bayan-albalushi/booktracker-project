import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../slices/adminSlice";
import userReducer from "../slices/userSlice";

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        user: userReducer
    }
});
