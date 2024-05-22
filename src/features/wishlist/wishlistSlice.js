import { createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const initialState = {
  wishItems: [],
  amount: 0,
  isLoading: true,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishItems = [];
    },
    removeFromWishlist: (state, action) => {
      try {
        const userObj = action.payload?.userObj;

    
        if (!userObj || !userObj.userWishlist) {
          console.error('removeFromWishlist - userObj or userObj.userWishlist is undefined');
          return;
        }
    
        const list = userObj.userWishlist;
        state.wishItems = list;
      } catch (error) {
        console.error('removeFromWishlist - Error:', error);
      }
    },
    
    updateWishlist: (state, action) => {
      try {
        const userObj = action.payload?.userObj;
    
        if (!userObj || !userObj.userWishlist) {
          console.error('updateWishlist - userObj or userObj.userWishlist is undefined');
          return;
        }
    
        const list = userObj.userWishlist;
        state.wishItems = list;
      } catch (error) {
        console.error('updateWishlist - Error:', error);
      }
    },
    
    
    
    
    
    calculateWishlistAmount: (state) => {
      let amount = 0;
      state.wishItems.forEach((item) => {
        amount += item.amount;
      });
      state.amount = amount;
    },
  },
});

export const {
  clearWishlist,
  removeFromWishlist,
  updateWishlist,
  calculateWishlistAmount,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
