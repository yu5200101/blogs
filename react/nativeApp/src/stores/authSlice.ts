// src/store/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
interface AuthState {
  token: string;
}

const initialState: AuthState = {
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    clearToken: (state) => {
      state.token = '';
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;