import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/stores'

interface CounterState {
  count: number
}

// 使用该类型定义初始 state
const initialState: CounterState = {
  count: 0
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increase(state) {
      state.count += 1
    },
    decrease(state) {
      state.count -= 1
    }
  }
})

export const { increase, decrease } = counterSlice.actions

export const selectCount = (state: RootState) => state.counter.count

export default counterSlice.reducer

