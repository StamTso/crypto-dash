import axios from 'axios';
import { describe, it, expect, vi, afterEach, Mock } from 'vitest';
import { fetchLivePrices } from '../priceService';

vi.mock('axios');

describe('priceService - fetchLivePrices', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('fetches prices for given coin IDs successfully', async () => {
    const mockResponse = {
      data: {
        bitcoin: { eur: 30000, last_updated_at: 1670000000 },
      },
    };

    (axios.get as Mock).mockResolvedValueOnce(mockResponse);

    const coinIds = ['bitcoin'];
    const prices = await fetchLivePrices(coinIds);

    expect(prices).toEqual(mockResponse.data);
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.coingecko.com/api/v3/simple/price', { params: {
        ids: 'bitcoin',
        include_last_updated_at: true,
        vs_currencies: 'eur',
      }
    });
  });

  it('handles API errors gracefully', async () => {
    (axios.get as Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchLivePrices(['bitcoin'])).rejects.toThrow('Failed to fetch live prices. Error: Network Error');
  });
});
