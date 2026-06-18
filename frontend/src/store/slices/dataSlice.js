import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload.employees || [];
      state.total = action.payload.total ?? state.total;
      state.totalPages = action.payload.totalPages ?? state.totalPages;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setEmployees, setLoading, setError, setPage } = dataSlice.actions;
export default dataSlice.reducer;
