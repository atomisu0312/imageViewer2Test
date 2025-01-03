import { createSlice } from '@reduxjs/toolkit'

export const isDetailOpenSlice = createSlice({
  name: 'isDetailOpen',
  initialState: {
    value: false,
  },
  reducers: {
    invertIsDetailOpen: (state) => {
      state.value = !state.value
    }
  },
})

// Action creators are generated for each case reducer function
export const { invertIsDetailOpen } = isDetailOpenSlice.actions

export default isDetailOpenSlice.reducer