import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice.ts"
import userReducer from "../features/userSlice.ts"
import farmReducer from "../features/farmSlice.ts"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from "redux-thunk"

const persistConfig = {
    key : 'root',
    storage : AsyncStorage
}

const combReducers = combineReducers({
    cart : cartReducer,
    user : userReducer,
    farm : farmReducer,
})

const persistdReducer = persistReducer(persistConfig, combReducers)

export const store = configureStore({
    reducer : persistdReducer,
    devTools : process.env.NODE_ENV !== 'production',
    middleware : (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck : false})
})

export const persistor = persistStore(store)