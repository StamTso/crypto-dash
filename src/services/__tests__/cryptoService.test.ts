import axios from 'axios';
import { describe, it, expect, vi, afterEach, Mock } from 'vitest';
import { fetchCryptos } from '../cryptoService';
import { BASE_URL, COINS_ENDPOINT } from '../../constants/apiConstants';
import { mockUnwatchedCoins } from '../../tests/mockData/mockCoinColumns';

vi.mock('axios');

describe('cryptoService - fetchCryptos', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('fetches a list of coins successfully', async () => {
    const mockResponse = mockUnwatchedCoins;

    (axios.get as Mock).mockResolvedValueOnce({data:mockResponse});

    const coins = await fetchCryptos();

    expect(coins).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}${COINS_ENDPOINT}`, { params: {
        vs_currency: 'eur',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false,
      }});
  });

  it('handles API errors gracefully', async () => {
    (axios.get as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(fetchCryptos()).rejects.toThrow('Failed to fetch coins');
  });
});
