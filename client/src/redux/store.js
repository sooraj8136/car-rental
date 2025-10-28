import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice"
import ownerReducer from "./features/ownerSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    owner: ownerReducer   
  }
})