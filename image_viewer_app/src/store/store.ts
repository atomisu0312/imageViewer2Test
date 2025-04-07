import { configureStore } from '@reduxjs/toolkit'
import isDetailOpenSliceReducer from '@/store/imageViewSlice'
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux'
import pixelReducer from './slices/pixelSlice'

export const store = configureStore({
  reducer: {
    isDetailOpenSlice: isDetailOpenSliceReducer,
    pixel: pixelReducer,
  },
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = useStore