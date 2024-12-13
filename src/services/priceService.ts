import axios from 'axios';
import { BASE_URL, PRICES_ENDPOINT } from '../constants/apiConstants';
import { PriceData } from './types';

export const fetchLivePrices = async (coinIds: string[]): Promise<Record<string, PriceData>> => {
  if (coinIds.length === 0) return {};
  try {
    const response = await axios.get(
      `${BASE_URL}${PRICES_ENDPOINT}`,
      {
        params: {
          ids: coinIds.join(','),
          vs_currencies: 'eur',
          include_last_updated_at: true
        },
      }
    );

    return response.data as Record<string, PriceData>;
  } catch (error) {
    throw new Error(`Failed to fetch live prices. ${error}.`);
  }
};
