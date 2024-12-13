import React from 'react';

interface BoardColumnProps {
  title: string;
  children?: React.ReactNode;
  width: string;
}

const BoardColumn = React.forwardRef<HTMLDivElement, BoardColumnProps>(
  ({ title, children, width }, ref) => {
    return (
      <div ref={ref} className={`${width} flex flex-col bg-white shadow-md rounded-md p-4`} data-testid={`board-column-${title}`}>
        <h2 className='text-lg font-bold mb-4 border-b pb-2'>{title}</h2>
        <div className='flex flex-col gap-3'>{children}</div>
      </div>
    );
  }
);

BoardColumn.displayName = 'BoardColumn';


export default BoardColumn;