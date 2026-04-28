import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <div className={`card-body ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={`card-title ${className}`}>{children}</h2>;
};
