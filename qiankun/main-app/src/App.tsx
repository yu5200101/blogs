import './App.css'
import { useNavigate } from "react-router";

function App() {
  const navigate = useNavigate()

  const handleClick = () => {
    localStorage.setItem('sharedData', JSON.stringify({ theme: 'dark' }));
    navigate('/subapp?page=1');
  }
  return (
    <>
      <button onClick={handleClick}>subapp</button>
    </>
  )
}

export default App
