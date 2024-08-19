import { createSlice } from "@reduxjs/toolkit";
import languages from "../data/languageList";

const loginUserDetails = {
    enterInApp : true,
    isLoggedIn : true,
    id : '666976d3482f5f7ff691e574',
    email  : 'sameer@gmail.com',
    phone : '+91 9817620774',
    language : 0,
    isAdmin : false,
    token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjY5NzZkMzQ4MmY1ZjdmZjY5MWU1NzQiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzE4NTkyNDU0fQ.xNuTGrhbqM0XfqM3St862gD1Huw7Om7ttLYjHH97o9o',
    currentAddressIndex : 0,
    name : 'sameer',
}

const adminUserDetails = {
    enterInApp : true,
    isLoggedIn : true,
    id : '663f66309e69fb4f2bca0b33',
    email  : 'admin@gmail.com',
    phone : '+91 9817620774',
    language : 0,
    isAdmin : true,
    token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjNmNjYzMDllNjlmYjRmMmJjYTBiMzMiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MTk3MjI4OTN9.K04xraC_SumiQMpfe9UoER_KLsH44NWoVVsdBBzQM_o',
    currentAddressIndex : 0,
    name : 'admin',
    coins : 0,
}

const userDetails = {
    enterInApp : false,
    isLoggedIn : false,
    id : '',
    email  : '',
    phone : '',
    language : 0,
    isAdmin : false,
    token : '',
    currentAddressIndex : 0,
    name : '',
    coins : 0,
}

const initialState = userDetails

export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        updateIsLoggedInStatus : (state : any , action : any) => {
            state.isLoggedIn = action.payload
            console.log(state.isLoggedIn)
        },
        updateid : (state : any , action : any) => {
            state.id = action.payload
        },
        updateEmail : (state : any , action : any) => {
            state.email = action.payload
        },
        updatePhone: (state : any , action : any) => {
            state.phone = action.payload
        },
        updateLanguage : (state : any , action : any) => {
            state.language = action.payload
        },
        updateIsAdmin: (state : any , action : any) => {
            state.isAdmin = action.payload
        },
        updateToken : (state : any ,action : any) => {
            state.token = action.payload
        },
        updateCurrentAddressIndex : (state : any , action : any) =>  {
            state.currentAddressIndex = action.payload
        },
        updateName : (state : any , action : any) => {
            state.name = action.payload
        },
        updateEnterInAppStatus : (state : any , action : any) => {
            state.enterInApp = action.payload
        }
    }
})

export const { 
    updateEmail, 
    updateid,
    updateIsAdmin,
    updateIsLoggedInStatus, 
    updatePhone, 
    updateToken, 
    updateLanguage, 
    updateCurrentAddressIndex, 
    updateName,
    updateEnterInAppStatus
} = userSlice.actions

export default userSlice.reducer