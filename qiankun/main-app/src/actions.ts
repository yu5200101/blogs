import { initGlobalState } from 'qiankun'
const initialState = { language: 'zh', theme: 'light' }
const actions = initGlobalState(initialState)
export default actions
