import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice.ts"
import userReducer from "../features/userSlice.ts"

export const store = configureStore({
    reducer : {
        cart : cartReducer,
        user : userReducer,
    }
})