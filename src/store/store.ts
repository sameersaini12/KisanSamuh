import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice.ts"
import userReducer from "../features/userSlice.ts"
import farmReducer from "../features/farmSlice.ts"

export const store = configureStore({
    reducer : {
        cart : cartReducer,
        user : userReducer,
        farm : farmReducer,
    }
})