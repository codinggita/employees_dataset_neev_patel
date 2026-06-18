import { createSlice } from '@reduxjs/toolkit';

const initialTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light';

const initialState = {
  theme: initialTheme,
  sidebarOpen: true,
  globalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;
