import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
};

const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) => {
  const baseClass = 'btn';
  const variantClass = variant === 'ghost' ? 'btn-ghost' : `btn-${variant}`;
  const sizeClass = size === 'md' ? '' : `btn-${size}`;

  return (
    <button className={`${baseClass} ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
