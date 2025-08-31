import React, { useDeferredValue, useState } from 'react';
import List from './components/List'

const Default: React.FC = () => {
  const [value, setValue] = useState('')
  const deferredValue = useDeferredValue(value)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  return <>
    <input value={value} onChange={handleChange}></input>
    <List query={deferredValue} />
  </>
};

export default Default;