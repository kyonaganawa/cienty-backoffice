import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsyncStoreState } from '..';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStoreState {
  user: AsyncStoreState<User | null>;
  token: string | null;
}

const initialState: AuthStoreState = {
  user: { data: null, loading: false, error: '' },
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user.data = action.payload;
      state.user.loading = false;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.user.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.user.error = action.payload;
      state.user.loading = false;
    },
    logout: (state) => {
      state.user.data = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setUser, setToken, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
