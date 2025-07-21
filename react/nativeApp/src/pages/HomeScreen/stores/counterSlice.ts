import { createSlice, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/stores'
import type { DataItem } from '../types'

interface CounterState {
  list: Array<DataItem>
}

// 使用该类型定义初始 state
const initialState: CounterState = {
  list: []
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    change(state, action: PayloadAction<DataItem>) {
      const {id, count} = action.payload
      const tempObjIndex = state.list.findIndex(item => item.id === id)
      if (tempObjIndex === -1) {
        state.list.push(action.payload)
        return
      }
      state.list[tempObjIndex].count = count
      if (!state.list[tempObjIndex].count) {
        state.list.splice(tempObjIndex, 1)
      }
    }
  }
})

export const { change } = counterSlice.actions

export const selectAllList = (state: RootState) => state.counter.list

export const selectCountByKey = createSelector(
  [selectAllList, (state: RootState, id) => id],
  (list, id) => {
    const temp = list.find(item => item.id === id)
    return temp?.count
  }
)

export const selectTotalPrice = createSelector(
  selectAllList,
  (list) => list.reduce((total: number, cur: DataItem) => {
    total += (cur.count || 0) * cur.price
    return total
  }, 0)
)

export default counterSlice.reducer

