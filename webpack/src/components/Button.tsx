import React from 'react'

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
  const buttonClasses = `btn btn-${variant} ${disabled ? 'disabled' : ''}`;
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;