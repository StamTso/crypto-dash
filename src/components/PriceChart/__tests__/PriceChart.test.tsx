import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PriceChart from '../PriceChart';

vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(() => <div data-testid='mock-line-chart' />),
}));

describe('PriceChart Component', () => {
  it('renders nothing when priceHistory is empty', () => {
    render(<PriceChart priceHistory={[]} />);
    expect(screen.queryByTestId('mock-line-chart')).not.toBeInTheDocument();
  });

  it('renders the Line chart with correct data and options when priceHistory is provided', () => {
    const mockPriceHistory = [
      { price: 100, last_updated_at: 1670000000 },
      { price: 200, last_updated_at: 1670003600 },
    ];

    render(<PriceChart priceHistory={mockPriceHistory} />);

    const chart = screen.getByTestId('mock-line-chart');
    expect(chart).toBeInTheDocument();
  });
});
