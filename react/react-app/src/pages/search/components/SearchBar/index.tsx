import {
  useState
} from 'react'
import styles from './index.module.scss'
import { SearchOutline } from 'antd-mobile-icons'
import { Input } from 'antd-mobile'
import { px2rem } from '@/utils/tools'

const SearchBar: React.FC = () => {
  let [searchVal, setSearchVal] = useState('')

  return (
    <div
      className={styles['search-header']}>
      <SearchOutline />
      <Input
        style={{
          '--font-size': px2rem('30px')
        }}
        className={styles['search-header-title']}
        value={searchVal}
        onChange={(val: string) => {
          setSearchVal(val)
        }}
        ></Input>
      <span className={styles['search-header-btn']}>搜索</span>
    </div>)
}

export default SearchBar
