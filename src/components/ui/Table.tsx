import React from 'react';

type TableProps = {
  columns: string[];
  children: React.ReactNode;
  className?: string;
};

const Table = ({ columns, children, className = '' }: TableProps) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table table-zebra table-sm md:table-md w-full">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
