import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'login',
  initialState: {
    gapiInitialized: false,
  },
  reducers: {
    initGapi: state => {
      state.gapiInitialized = true;
    },
    requestAuth: state => state,
    authSuccess: state => state,
  },
});

export const { initGapi, requestAuth, authSuccess } = slice.actions;

export const selectIsGapiInitialized = state => state.login.gapiInitialized;

export const loginReducer = slice.reducer;
