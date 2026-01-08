import { createSlice } from '@reduxjs/toolkit';
import { AsyncStoreState } from '..';
import { Cliente } from '@/lib/mock-data/clientes';

interface ClientStoreState {
  selectedClient: AsyncStoreState<Cliente | null>;
}

const initialState: ClientStoreState = {
  selectedClient: { data: null, loading: false, error: '' },
};

export const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {},
});

export default clientSlice.reducer;
