import axios from 'axios';
import { BASE_URL, COINS_ENDPOINT } from '../constants/apiConstants';
import { CryptoCoin } from './types';

export const fetchCryptos = async (): Promise<CryptoCoin[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}${COINS_ENDPOINT}`,
      {
        params: {
          vs_currency: 'eur',
          order: 'market_cap_desc',
          per_page: 20,
          page: 1,
          sparkline: false,
        },
      }
    );

    return response.data.map((coin: CryptoCoin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch coins. ${error}`);
  }
};
