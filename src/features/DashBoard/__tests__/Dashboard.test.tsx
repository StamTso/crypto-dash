import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import DashBoard from '../DashBoard';
import { useCryptoContext } from '../../../hooks/useCryptoContext';
import { mockUnwatchedCoins, mockWatchedCoins } from '../../../tests/mockData/mockCoinColumns';

// Mock useCryptoContext
vi.mock('../../../hooks/useCryptoContext', () => ({
  useCryptoContext: vi.fn(),
}));

describe('DashBoard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both columns and their items', () => {
    (useCryptoContext as Mock).mockReturnValue({
      unwatchedCoins: mockUnwatchedCoins,
      watchedCoins: mockWatchedCoins,
      moveCoin: vi.fn(),
      loadingCoinsList: false,
      priceHistory: {},
      loadingChartDataCoins: new Set(),
    });

    render(<DashBoard />);


    expect(screen.getByTestId('board-column-Unwatched')).toBeInTheDocument();
    expect(screen.getByTestId('board-column-Watched')).toBeInTheDocument();
    expect(screen.getByTestId('board-item-bitcoin')).toBeInTheDocument();
    expect(screen.getByTestId('board-item-ethereum')).toBeInTheDocument();
  });

  it('displays loading message when loadingCoinsList is true', () => {
    (useCryptoContext as Mock).mockReturnValue({
      unwatchedCoins: [],
      watchedCoins: [],
      moveCoin: vi.fn(),
      loadingCoinsList: true,
      priceHistory: {},
      loadingChartDataCoins: new Set(),
    });

    render(<DashBoard />);

    expect(screen.getByText('Fetching Coins...')).toBeInTheDocument();
  });
});
