import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  userId: localStorage.getItem('token') || false,
  isLoggedIn: localStorage.getItem('token') ? true : false,
  darkMode: true
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state) => {
      state.isLoggedIn = true;
      state.userId = localStorage.getItem('token');
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.userId = false;
    },
    changeMode: (state) => {
      state.darkMode = !state.darkMode;
      if(state.darkMode){
        document.querySelector('html').setAttribute('data-theme', "dark");
      }else{
        document.querySelector('html').setAttribute('data-theme', "light");
      }
    }
  },
});

// console.log(cartSlice);
export const { loginUser, logoutUser, changeMode } = authSlice.actions;

export default authSlice.reducer;
