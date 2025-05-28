import {
  createSlice,
  nanoid,
  createSelector
} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/stores'

interface DataItem {
  id: string
  title: string
  content: string
  user: string
}
// 为 slice state 定义一个类型
interface CounterState {
  value: number
  list: Array<DataItem>
  status: string
  error: string
}

// 使用该类型定义初始 state
const initialState: CounterState = {
  value: 0,
  status: '',
  error: '',
  list: []
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。它
      // 并不是真正的改变状态值，因为它使用了 Immer 库
      // 可以检测到“草稿状态“ 的变化并且基于这些变化生产全新的
      // 不可变的状态
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    // 使用 PayloadAction 类型声明 `action.payload` 的内容
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
    setArticle: {
      reducer(state, action: PayloadAction<DataItem>) {
        const {id, title, content} = action.payload
        const temp: DataItem | undefined = state.list.find(item => item.id === id)
        if (temp) {
          temp.title = title
          temp.content = content
        }
      },
      prepare({title, content}) {
        return {
          payload: {
            id: nanoid(),
            title,
            content
          }
        }
      }
    }
  },
  extraReducers(builder) {
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions

// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectCount = (state: RootState) => state.counter.value

export const selectAllPosts = (state: RootState) => state.counter.list

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state: RootState, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)

export default counterSlice.reducer