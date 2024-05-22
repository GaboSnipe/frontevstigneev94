import {configureStore, createSlice} from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";
import axios from "../axios.js"



const userSlice = createSlice({
    name: 'user',
    initialState: {
      data: null,
      status: 'idle',
      error: null
    },
    reducers: {
      setUser: (state, action) => {
        state.data = action.payload;
      },
      setStatus: (state, action) => {
        state.status = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
      }
    }
  });
  
  export const { setUser, setStatus, setError } = userSlice.actions;
  
  export const fetchUserData = () => async dispatch => {
    dispatch(setStatus('loading'));
    try {
      const response = await axios.get('/auth/me');
      dispatch(setUser(response.data));
      dispatch(setStatus('succeeded'));
    } catch (error) {
      dispatch(setError(error.toString()));
      dispatch(setStatus('failed'));
    }
  };

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        user: userSlice.reducer

    }
});



export default store;