import { useState, useEffect, useRef, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { fetchCryptos, CryptoCoin } from '../services/cryptoService';
import { fetchLivePrices, PriceData } from '../services/priceService';
import { CryptoContext, PriceEntry } from '../hooks/useCryptoContext';
import { moveCoin } from '../utils/moveCoin';
import { DroppableId } from '../features/DashBoard/types';
import { UNWATCHED_COLUMN_ID } from '../constants/dashBoardConstants';

export const CryptoProvider = ({ children }: { children: ReactNode }) => {
  const [unwatchedCoins, setUnwatchedCoins] = useState<CryptoCoin[]>([]);
  const [watchedCoins, setWatchedCoins] = useState<CryptoCoin[]>([]);
  const [loadingCoinsList, setLoadingCoinsList] = useState<boolean>(false);
  const [priceHistory, setPriceHistory] = useState<Record<string, PriceEntry[]>>({});
  const [loadingChartDataCoins, setLoadingChartDataCoins] = useState<Set<string>>(new Set());

  const watchedColumnRef = useRef(watchedCoins);

  const updatePriceHistory = (
    previousPriceHistory: Record<string, PriceEntry[]>,
    priceData: Record<string, PriceData>,
    watchedCoins: CryptoCoin[]
  ): Record<string, PriceEntry[]> => {
    const updatedPriceHistory = { ...previousPriceHistory };

    watchedCoins.forEach((coin) => {
      const coinPriceData = priceData[coin.id];

      if (coinPriceData) {
        const { eur: price, last_updated_at } = coinPriceData;

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
      setLoadingCoinsList(true);
      try {
        const data = await fetchCryptos();
        setUnwatchedCoins(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch coins list, check your network connection and refresh the page.',{
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
        });
      } finally {
        setLoadingCoinsList(false);
      }
    };

    const getLivePrices = async () => {
      if (watchedColumnRef.current.length) {
        try {
          const priceData = await fetchLivePrices(watchedColumnRef.current.map(coin => coin.id));

          setPriceHistory(previous => updatePriceHistory(previous, priceData, watchedColumnRef.current))
        } catch (error) {
          console.error('Error fetching real-time prices:', error);
        }
      }
    }
    // call the live price endpoint every minute
    const intervalId = setInterval(getLivePrices, 60000);
    getLivePrices();
    loadCryptos();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    watchedColumnRef.current = watchedCoins;
  }, [watchedCoins]);

  const handleMoveCoin = async (
    coinId: string,
    fromColumnId: DroppableId,
    toColumnId: DroppableId,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const fromColumn = fromColumnId === UNWATCHED_COLUMN_ID ? unwatchedCoins : watchedCoins;
    const toColumn = toColumnId === UNWATCHED_COLUMN_ID ? unwatchedCoins : watchedCoins;

    const result = moveCoin(
      coinId,
      fromColumn,
      toColumn,
      fromColumnId,
      toColumnId,
      sourceIndex,
      destinationIndex
    );

    if (fromColumnId === toColumnId) {
      if (fromColumnId === UNWATCHED_COLUMN_ID) {
        setUnwatchedCoins(result.updatedFromColumn);
      } else {
        setWatchedCoins(result.updatedFromColumn);
      }
    } else {
      if (fromColumnId === UNWATCHED_COLUMN_ID) {
        setUnwatchedCoins(result.updatedFromColumn);
        setWatchedCoins(previous => result.updatedToColumn || previous);
        setLoadingChartDataCoins((previous) => new Set(previous).add(coinId));

        try {
          const priceData = await fetchLivePrices([coinId]);
          setPriceHistory(previous => updatePriceHistory(previous, priceData, result.updatedToColumn || []));

          setLoadingChartDataCoins((prev) => {
            const updated = new Set(prev);
            updated.delete(coinId);
            return updated;
          });
        } catch (error) {
          console.error(`Error fetching initial price for coin ${coinId}:`, error);

          const rollbackResult = moveCoin(
            coinId,
            result.updatedToColumn || watchedCoins,
            result.updatedFromColumn,
            'watched',
            'unwatched',
            destinationIndex
          )

          setUnwatchedCoins(previous => rollbackResult.updatedToColumn || previous);
          setWatchedCoins(rollbackResult.updatedFromColumn);

          toast.error(`Failed to fetch price data for ${coinId}. Returning to "Unwatched".`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
          });

          setLoadingChartDataCoins((prev) => {
            const updated = new Set(prev);
            updated.delete(coinId);
            return updated;
          });
        }
      } else {
        setWatchedCoins(result.updatedFromColumn);
        setUnwatchedCoins(previous => result.updatedToColumn || previous);
      }
    }
  };

  return (
    <CryptoContext.Provider value={{ unwatchedCoins, watchedCoins, moveCoin: handleMoveCoin, loadingCoinsList, priceHistory, loadingChartDataCoins }}>
      {children}
    </CryptoContext.Provider>
  );
};