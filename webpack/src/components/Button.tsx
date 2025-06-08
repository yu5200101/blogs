import React from 'react'
import { sleepTime } from '@/utils/tools'

interface ButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  variant = 'primary',
  disabled = false,
  children
}) => {
  const getTime = async() => {
    await sleepTime(1000)
    const arr = [1, 2, 3]
    console.log(arr.includes(1))
    console.log('getTime')
  }
  const onButtonClick = () => {
    onClick()
    getTime()
  }

  const buttonClasses = `btn btn-${variant} ${disabled ? 'disabled' : ''}`;
  return (
    <button
      className={buttonClasses}
      onClick={onButtonClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;