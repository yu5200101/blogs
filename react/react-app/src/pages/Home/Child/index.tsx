import { useEffect } from 'react'
import { useLocation } from 'react-router'

function Child() {
  const location = useLocation()
  useEffect(() => {
    console.log('change', location.pathname)
  }, [location.pathname])

  return <>
    <span>child</span>
  </>
}

export default Child