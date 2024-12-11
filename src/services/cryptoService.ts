import axios from 'axios';
import { BASE_URL, COINS_ENDPOINT } from '../constants/apiConstants';

export interface CryptoCoin {
  id: string;
  name: string;
  current_price: number;
  symbol: string;
  image: string;
  last_updated_at: number;
}

export const fetchCryptos = async (): Promise<CryptoCoin[]> => {
  const response = await axios.get(
    `${BASE_URL}${COINS_ENDPOINT}`,
    {
      params: {
        vs_currency: 'usd',
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
    current_price: coin.current_price,
    symbol: coin.symbol,
    image: coin.image,
  }));
};
