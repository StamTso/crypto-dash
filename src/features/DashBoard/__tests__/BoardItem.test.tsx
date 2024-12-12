import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BoardItem from '../BoardItem';

vi.mock('../../../components/PriceChart/PriceChart.tsx', () => ({
  default: vi.fn(() => <div data-testid="mock-price-chart" />),
}));

describe('BoardItem Component', () => {
  it('renders the name and image correctly', () => {
    render(<BoardItem name="Bitcoin" imageUrl="bitcoin.png" />);

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();

    const image = screen.getByAltText('Bitcoin');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'bitcoin.png');
  });

  it('renders a loading message when isLoading is true', () => {
    render(<BoardItem name="Bitcoin" isLoading={true} />);

    expect(screen.getByText('Fetching Prices...')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-price-chart')).not.toBeInTheDocument();
  });

  it('renders the PriceChart when priceHistory is provided and not empty', () => {
    const mockPriceHistory = [
      { price: 100, last_updated_at: 1670000000 },
      { price: 200, last_updated_at: 1670003600 },
    ];

    render(<BoardItem name="Bitcoin" priceHistory={mockPriceHistory} isLoading={false} />);

    expect(screen.getByTestId('mock-price-chart')).toBeInTheDocument();
    expect(screen.queryByText('Fetching Prices...')).not.toBeInTheDocument();
  });

  it('handles missing imageUrl gracefully', () => {
    render(<BoardItem name="Bitcoin" />);

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();

    const image = screen.getByAltText('Bitcoin');
    expect(image).toBeInTheDocument();
    expect(image).not.toHaveAttribute('src');
  });
});
