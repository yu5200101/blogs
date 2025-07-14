import { configureStore, combineReducers } from '@reduxjs/toolkit'
import counter from '@/app/example/stores/counterSlice'
import auth from './authSlice'
import { apiSlice } from '@/app/api/apiSlice'
import storage from 'redux-persist/lib/storage/session'; // sessionStorage作为存储引擎
import { persistReducer } from 'redux-persist';
import { createWrapper } from 'next-redux-wrapper';

const rootReducer = combineReducers({
    counter,
    auth,
    [apiSlice.reducerPath]: apiSlice.reducer
  });

// 配置持久化
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter'] // 只持久化counter状态
};

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: process.env.NODE_ENV !== 'production',
});