import React, { useDeferredValue, useState, useRef } from 'react';
import List from './components/List'

const Default: React.FC = () => {
  const [value, setValue] = useState('')
  const deferredValue = useDeferredValue(value)
  const [valueDebounce, setValueDebounce] = useState('')
  const flag = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null | number>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  function debounce(fn: Function) {
    return function() {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      timer.current = setTimeout(() => {
        fn()
        clearTimeout(timer.current as number)
      }, 1000);
    }
  }
  const handleDebounceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!flag.current) {
      setValueDebounce(value)
      flag.current = true
    }
    setValueDebounce(value)
    debounce(() => {
      console.log(value, 'value')
    })()
  }
  return <>
    <input value={value} onChange={handleChange}></input>
    <List query={deferredValue} />
    <span>防抖</span>
    <input value={valueDebounce} onChange={handleDebounceChange}/>
  </>
};

export default Default;