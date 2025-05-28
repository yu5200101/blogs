import { configureStore } from '@reduxjs/toolkit'
import counter from '@/pages/Home/stores'
import auth from './authSlice'
import { apiSlice } from '@/api/apiSlice'

const stores = configureStore({
  reducer: {
    counter,
    auth,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
})
// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof stores.getState>
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof stores.dispatch

export default stores