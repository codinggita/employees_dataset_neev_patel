import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.role = action.payload?.role || null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.role = null;
    },
  },
});

export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
