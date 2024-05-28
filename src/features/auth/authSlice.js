import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  usId: localStorage.getItem('id') || false,
  userId: localStorage.getItem('token') || false,
  isLoggedIn: localStorage.getItem('token') ? true : false,
  userData: null,
  darkMode: localStorage.getItem('darkMode')
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state) => {
      state.isLoggedIn = true;
      state.userId = localStorage.getItem('token');
      state.usId = localStorage.getItem('id');
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.userId = false;
      state.usId = false;
    },
    changeMode: (state) => {
      state.darkMode = !state.darkMode;
      const currentMode = localStorage.getItem("darkMode") === "true";
      const newMode = !currentMode;
      localStorage.setItem("darkMode", newMode);
      if (newMode) {
        document.querySelector('html').setAttribute('data-theme', "dark");
      } else {
        document.querySelector('html').setAttribute('data-theme', "light");
      }
    }
  },
});

export const { loginUser, logoutUser, getUserData, changeMode } = authSlice.actions;

export default authSlice.reducer;
