import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchStoreState {
  query: string;
  filters: Record<string, unknown>;
}

const initialState: SearchStoreState = {
  query: '',
  filters: {},
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setFilters: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.filters = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.filters = {};
    },
  },
});

export const { setSearchQuery, setFilters, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
