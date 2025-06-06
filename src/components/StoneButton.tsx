import React from 'react';

interface StoneButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const StoneButton: React.FC<StoneButtonProps> = ({ children, ...props }) => {
  return (
    <button className="btn-stone" {...props}>
      {children}
    </button>
  );
};
