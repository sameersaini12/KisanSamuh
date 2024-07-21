import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    CartPrice : 0,
    CartList : [],
    OrderHistoryList : [],
    totalItemInCart : 0
}

export const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers : {
        addToCart : (state :any, action: any ) => {
            let found = false;
            let cartItem = action.payload
            for(let i=0;i<state.CartList.length;i++) {
                if(state.CartList[i].id == cartItem.id) {
                    found = true
                    let sameSizeFound = false
                    for(let j=0;j<state.CartList[i].price.length;j++) {
                        if (state.CartList[i].price[j].size == cartItem.price[0].size) {
                            sameSizeFound = true;
                            state.CartList[i].price[j].quantity++;
                            break;
                          }
                    }
                    if(sameSizeFound==false) {
                        state.CartList[i].price.push(cartItem.price[0]);
                    }
                    state.CartList[i].price.sort((a: any, b: any) => {
                        if (a.size > b.size) {
                          return -1;
                        }
                        if (a.size < b.size) {
                          return 1;
                        }
                        return 0;
                    });
                    break;
                }
            }
            if(found==false){
                state.CartList.push(cartItem)
            }
            state.totalItemInCart = state.totalItemInCart+1
        },
        calculateCartPrice : (state :any) => {
            let totalprice = 0;
            for (let i = 0; i < state.CartList.length; i++) {
              let tempprice = 0;
              for (let j = 0; j < state.CartList[i].price.length; j++) {
                tempprice =
                  tempprice +
                  parseFloat(state.CartList[i].price[j].price) *
                    state.CartList[i].price[j].quantity;
              }
              state.CartList[i].ItemPrice = tempprice.toFixed(2).toString();
              totalprice = totalprice + tempprice;
            }
            state.CartPrice = totalprice.toFixed(2).toString();
        },
        incrementCartItemQuantity : (state : any , action : any) => {
            const id = action.payload.id
            const size = action.payload.size

            for(let i=0;i<state.CartList.length;i++) {
                if(state.CartList[i].id == id) {
                    for(let j=0;j<state.CartList[i].price.length;j++) {
                        if(state.CartList[i].price[j].size == size) {
                            state.CartList[i].price[j].quantity++;
                            break;
                        }
                    }
                }
            }
            state.totalItemInCart = state.totalItemInCart+1
        },
        decrementCartItemQuantity : (state : any , action : any) => {
            const id = action.payload.id
            const size = action.payload.size 

            for(let i=0;i<state.CartList.length;i++) {
                if(state.CartList[i].id == id) {
                    for(let j=0;j<state.CartList[i].price.length;j++) {
                        if(state.CartList[i].price[j].size == size) {
                            if(state.CartList[i].price.length > 1) {
                                if(state.CartList[i].price[j].quantity > 1) {
                                    state.CartList[i].price[j].quantity--;
                                }else {
                                    state.CartList[i].price.splice(j,1)
                                }
                            }else {
                                if(state.CartList[i].price[j].quantity > 1) {
                                    state.CartList[i].price[j].quantity--
                                }else {
                                    state.CartList.splice(i,1)
                                }
                            }
                            break;
                        }
                    }
                }
            }
            state.totalItemInCart = state.totalItemInCart-1
        },
        updateAfterOrder : (state : any) => {
            state.CartList = []
            state.CartPrice = 0
            state.totalItemInCart = 0
        },
        updateTotalItemInCart : (state : any , action : any) => {
            state.totalItemInCart = action.payload
        }
        // addItemToOrderHistoryFromCart : (state : any) => {
        //     let temp = state.CartList.reduce(
        //         (accumulator: number, currentValue: any) =>
        //           accumulator + parseFloat(currentValue.ItemPrice),
        //         0,
        //       ); 

        //       if (state.OrderHistoryList.length > 0) {
        //         state.OrderHistoryList.unshift({
        //           OrderDate:
        //             new Date().toDateString() +
        //             ' ' +
        //             new Date().toLocaleTimeString(),
        //           CartList: state.CartList,
        //           CartListPrice: temp.toFixed(2).toString(),
        //         });
        //       } else {
        //         state.OrderHistoryList.push({
        //           OrderDate:
        //             new Date().toDateString() +
        //             ' ' +
        //             new Date().toLocaleTimeString(),
        //           CartList: state.CartList,
        //           CartListPrice: temp.toFixed(2).toString(),
        //         });
        //       }
        //       console.log(state.OrderHistoryList)
        //       state.CartList = [];
        //       state.CartPrice = 0
        // }

    }
})

export const {addToCart , calculateCartPrice , incrementCartItemQuantity , decrementCartItemQuantity, updateAfterOrder} = cartSlice.actions

export default cartSlice.reducer
