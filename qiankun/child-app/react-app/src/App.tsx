import './App.css'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

function App() {
  const location = useLocation()

  useEffect(() => {
    // Google Analytics
    console.log(location, 'location')
  }, [location]);
  const handleClick = () => {
    qiankunWindow.EVENT_BUS.emit('user-login', { userId: 123 });
    // 子应用读取
    const data = JSON.parse(localStorage.getItem('sharedData') as string);
    console.log(data, 'data')
  }
  return (
    <>
      <div>react-child-app</div>
      <button onClick={handleClick}>click</button>
    </>
  )
}

export default App
