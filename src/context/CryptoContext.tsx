import { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { fetchCryptos, CryptoCoin } from '../services/cryptoService';
import { fetchLivePrices, PriceData } from '../services/priceService';
import { DroppableId } from '../features/DashBoard/types';
import { UNWATCHED_COLUMN_ID } from '../constants/dashBoardConstants';

interface CryptoContextType {
  unwatchedCoins: CryptoCoin[];
  watchedCoins: CryptoCoin[];
  priceHistory: Record<string, PriceEntry[]>;
  moveCoin: (
    coinId: string,
    fromColumnId: DroppableId,
    toColumnId: DroppableId,
    sourceIndex?: number,
    destinationIndex?: number
  ) => void;
  loading: boolean;
}

interface PriceEntry {
  price: number;
  last_updated_at: number;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const CryptoProvider = ({ children }: { children: ReactNode }) => {
  const [unwatchedCoins, setUnwatchedCoins] = useState<CryptoCoin[]>([]);
  const [watchedCoins, setWatchedCoins] = useState<CryptoCoin[]>([]);
  const [priceHistory, setPriceHistory] = useState<Record<string, PriceEntry[]>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const watchedColumnRef = useRef(watchedCoins);

  const updatePriceHistory = (
    previousPriceHistory: Record<string, PriceEntry[]>,
    coinPrices: Record<string, PriceData>,
    watchedCoins: CryptoCoin[]
  ): Record<string, PriceEntry[]> => {
    const updatedPriceHistory = { ...previousPriceHistory };

    watchedCoins.forEach((coin) => {
      const coinData = coinPrices[coin.id];

      if (coinData) {
        const { eur: price, last_updated_at } = coinData;

        const lastEntry = updatedPriceHistory[coin.id]?.[updatedPriceHistory[coin.id].length - 1];
        const currentTimeStamp = last_updated_at;
        const lastTimeStamp = lastEntry?.last_updated_at;

        if (lastTimeStamp === currentTimeStamp) {
          console.warn(`Stale data for ${coin.id}, skipping update.`);
          return;
        }

        if (!updatedPriceHistory[coin.id]) {
          updatedPriceHistory[coin.id] = [];
        }
        updatedPriceHistory[coin.id].push({ price, last_updated_at: currentTimeStamp })
      }
    });

    console.log(updatedPriceHistory);
    return updatedPriceHistory;
  }

  useEffect(() => {
    const loadCryptos = async () => {
      setLoading(true);
      try {
        const data = await fetchCryptos();
        setUnwatchedCoins(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const getLivePrices = async () => {
      if (watchedColumnRef.current.length) {
        try {
          const coinPrices = await fetchLivePrices(watchedColumnRef.current.map(coin => coin.id));

          setPriceHistory(previousPriceHistory => updatePriceHistory(previousPriceHistory, coinPrices, watchedColumnRef.current))
        } catch (error) {
          console.log('Error fetching real-time prices:', error);
        }
      }
    }

    const intervalId = setInterval(getLivePrices, 60000);
    getLivePrices();
    loadCryptos();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    watchedColumnRef.current = watchedCoins;
  }, [watchedCoins]);

  const moveWithinColumn = (
    column: CryptoCoin[],
    sourceIndex: number,
    destinationIndex: number
  ): CryptoCoin[] => {
    const updatedColumn = [...column];
    const [movedCoin] = updatedColumn.splice(sourceIndex, 1);
    updatedColumn.splice(destinationIndex, 0, movedCoin);
    return updatedColumn;
  };

  const moveBetweenColumns = (
    fromColumn: CryptoCoin[],
    toColumn: CryptoCoin[],
    coinId: string,
    destinationIndex: number
  ): { updatedFromColumn: CryptoCoin[]; updatedToColumn: CryptoCoin[] } => {
    const updatedFromColumn = [...fromColumn];
    const updatedToColumn = [...toColumn];
    const coinIndex = updatedFromColumn.findIndex((coin) => coin.id === coinId);
    if (coinIndex > -1) {
      const [movedCoin] = updatedFromColumn.splice(coinIndex, 1);
      updatedToColumn.splice(destinationIndex, 0, movedCoin);
    }

    return { updatedFromColumn, updatedToColumn };
  };

  const moveCoin = (
    coinId: string,
    fromColumnId: DroppableId,
    toColumnId: DroppableId,
    sourceIndex?: number,
    destinationIndex?: number
  ) => {
    // Reordering within the same column
    if (fromColumnId === toColumnId && sourceIndex !== undefined && destinationIndex !== undefined) {
      if (fromColumnId === UNWATCHED_COLUMN_ID) {
        setUnwatchedCoins(moveWithinColumn(unwatchedCoins, sourceIndex, destinationIndex));
      } else {
        setWatchedCoins(moveWithinColumn(watchedCoins, sourceIndex, destinationIndex));
      }
      return;

      // Moving between columns
    } else if (destinationIndex !== undefined) {
      const fromColumn = fromColumnId === UNWATCHED_COLUMN_ID ? unwatchedCoins : watchedCoins;
      const toColumn = toColumnId === UNWATCHED_COLUMN_ID ? unwatchedCoins : watchedCoins;

      const { updatedFromColumn, updatedToColumn } = moveBetweenColumns(
        fromColumn,
        toColumn,
        coinId,
        destinationIndex
      );

      if (fromColumnId === UNWATCHED_COLUMN_ID) {
        setUnwatchedCoins(updatedFromColumn);
        setWatchedCoins(updatedToColumn);

        fetchLivePrices([coinId]).then(coinPrices => {
          setPriceHistory(previousPriceHistory =>
            updatePriceHistory(previousPriceHistory, coinPrices, updatedToColumn.filter(coin => coin.id === coinId))
          );
        });
      } else {
        setWatchedCoins(updatedFromColumn);
        setUnwatchedCoins(updatedToColumn);
      }
    }
  };

  return (
    <CryptoContext.Provider value={{ unwatchedCoins, watchedCoins, moveCoin, loading, priceHistory }}>
      {children}
    </CryptoContext.Provider>
  );
};

export default CryptoContext;