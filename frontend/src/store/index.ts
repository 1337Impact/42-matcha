import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import profileFilterSlice from './profileFilterSlice'

export const store = configureStore({
  reducer: {
    userSlice,
    profileFilterSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch