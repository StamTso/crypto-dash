import { createContext, useContext } from 'react';
import { CryptoCoin } from '../services/cryptoService';
import { DroppableId } from '../features/DashBoard/types';


export interface CryptoContextType {
  unwatchedCoins: CryptoCoin[];
  watchedCoins: CryptoCoin[];
  priceHistory: Record<string, PriceEntry[]>;
  moveCoin: (
    coinId: string,
    fromColumnId: DroppableId,
    toColumnId: DroppableId,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  loadingCoinsList: boolean;
  loadingChartDataCoins: Set<string>;
}

export interface PriceEntry {
  price: number;
  last_updated_at: number;
}

export const CryptoContext = createContext<CryptoContextType | undefined>(undefined);


export const useCryptoContext = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};