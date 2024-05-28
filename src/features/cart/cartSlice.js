import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


const initialState = {
    cartItems: [],
    amount: 0,
    total: 0,
    isLoading: true,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        removeItem: (state, action) => {
            try {
              const userObj = action.payload?.userObj;
      
          
              if (!userObj || !userObj.cartitems) {
                console.error('removeFromWishlist - userObj or userObj.cartitems is undefined');
                return;
              }
          
              const list = userObj.cartitems;
              state.cartItems = list;
            } catch (error) {
              console.error('removeFromWishlist - Error:', error);
            }
          },
        updateCartAmount: (state, action) => {
            const cartItem = state.cartItems.find(item => item.id === action.payload.id);
            cartItem.amount = Number(action.payload.amount);
            cartSlice.caseReducers.calculateTotals(state);
        },
        updateCart: (state, action) => {
            try {
              const userObj = action.payload?.userObj;
          
              if (!userObj || !userObj.cartitems) {
                console.error('updateWishlist - userObj or userObj.cartitems is undefined');
                return;
              }
          
              const list = userObj.cartitems;
              state.cartItems = list;
            } catch (error) {
              console.error('updateWishlist - Error:', error);
            }
          },
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            state.cartItems.forEach(item => {
                amount += item.amount;
                total += item.amount * item.price;
            });
            state.amount = amount;
            state.total = total;
        },
        addToCart: (state, action) => {
            const cartItem = state.cartItems.find(item => item.id === action.payload.id);
            if (!cartItem) {
                state.cartItems.push({ ...action.payload, amount: 1 }); // Устанавливаем начальное количество равным 1
            } else {
                cartItem.amount += action.payload.amount; // Увеличиваем количество на 1
            }
            cartSlice.caseReducers.calculateTotals(state);
        }
    }
})

export const { clearCart, removeItem, updateCartAmount, updateCart, decrease, calculateTotals, addToCart } = cartSlice.actions;

export default cartSlice.reducer;