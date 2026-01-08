import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import clientReducer from './client';
import searchReducer from './search';

export interface AsyncStoreState<T> {
  data: T;
  loading: boolean;
  error: string;
  message?: {
    type: 'error' | 'success' | 'warning';
    text: string;
  };
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
