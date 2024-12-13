import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BoardColumn from '../BoardColumn';

describe('BoardColumn Component', () => {
  it('renders correctly with title, children, and width props', () => {
    render(
      <BoardColumn title='Test Column' width='w-1/2'>
        <p>Child Content</p>
      </BoardColumn>
    );

    const column = screen.getByText('Test Column').closest('div');

    expect(screen.getByText('Test Column')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
    expect(column).toHaveClass('w-1/2');
  });

  it('applies default styles and renders children in a flex column', () => {
    render(
      <BoardColumn title='Styled Column' width='w-1/4'>
        <div>Child One</div>
        <div>Child Two</div>
      </BoardColumn>
    );


    const column = screen.getByText('Styled Column').closest('div');

    expect(column).toHaveClass('flex flex-col bg-white shadow-md rounded-md p-4');
    expect(screen.getByText('Child One')).toBeInTheDocument();
    expect(screen.getByText('Child Two')).toBeInTheDocument();
  });

  it('forwards refs correctly', () => {
    const ref = vi.fn();
    render(
      <BoardColumn title='Ref Column' width='w-1/3' ref={ref}>
        <p>Ref Test</p>
      </BoardColumn>
    );

    expect(ref).toBeCalled();
  });
});
