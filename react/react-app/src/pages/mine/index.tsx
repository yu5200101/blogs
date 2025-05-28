import { useGetUserInfoQuery, selectUsersData } from '@/stores/userSlice'
import { useAppSelector } from '@/stores/hook'

function Mine() {
  const {
    data,
    isSuccess
  } = useGetUserInfoQuery()
  const userData = useAppSelector(state => selectUsersData(state))
  return (
    <div>
      {isSuccess && <span>{JSON.stringify(data)}</span>}
      <span>{JSON.stringify(userData)}</span>
      我的
    </div>
  );
}

export default Mine