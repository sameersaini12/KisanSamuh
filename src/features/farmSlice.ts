import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    totalFarms : 0
}

export const farmSlice = createSlice({
    name : "farm",
    initialState,
    reducers : {
        updateTotalFarms : (state : any , action : any) => {
            state.totalFarms = action.payload
        }
    }
})

export const {updateTotalFarms} = farmSlice.actions

export default farmSlice.reducer
