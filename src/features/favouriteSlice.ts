import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    FavouriteList : []
}

export const favouriteSlice = createSlice({
    name : "favourite",
    initialState,
    reducers : {
        addToFavouriteList : (state : any , action : any) => {
            const id = action.payload.id
            for(let i=0;i<state.FavouriteList.length;i++) {
                if(state.FavouriteList[i].id ==id) {
                    
                }
            }
        }
    }
})
