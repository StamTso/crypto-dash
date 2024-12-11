import axios from 'axios';
import { BASE_URL, PRICES_ENDPOINT } from '../constants/apiConstants';

export interface PriceData {
    eur: number;
    last_updated_at: number;
}

export const fetchLivePrices = async (coinIds: string[]): Promise<Record<string, PriceData>> => {
  if (coinIds.length === 0) return {};

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
};
