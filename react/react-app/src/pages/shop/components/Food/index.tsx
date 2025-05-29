import { lazy, memo, useMemo } from "react"
import { useGetListByTypeQuery, useList } from '@/stores/shopList'
import type { DataItem } from '@/pages/shop/types'

const FoodItem = lazy(() => import('../FoodItem'))

interface MyComponentProps {
  type: string
}
const Food: React.FC<MyComponentProps> = memo(({type}) => {
  const body = useMemo(() => ({ type }), [type])
  const {isSuccess} = useGetListByTypeQuery(body)
  const dataList = useList(body)
  return <>
    {isSuccess && dataList.map((item: DataItem) => <FoodItem
      key={item.id}
      foodId={item.id}
      body={body}
    />)}
  </>
})

export default Food