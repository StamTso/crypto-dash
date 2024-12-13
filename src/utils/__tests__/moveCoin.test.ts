import { describe, expect, it } from 'vitest';
import { moveCoin } from '../moveCoin';
import { mockWatchedCoins, mockUnwatchedCoins } from '../../tests/mockData/mockCoinColumns';
import { UNWATCHED_COLUMN_ID, WATCHED_COLUMN_ID } from '../../constants/dashBoardConstants';

describe('moveCoin Function', () => {
    it('reorders coins within the same list', () => {
        const fromList = mockWatchedCoins;
        const result = moveCoin('ethereum', fromList, [], WATCHED_COLUMN_ID, WATCHED_COLUMN_ID, 1, 0);

        expect(result.updatedFromColumn).toEqual([
            { id: 'ethereum', name: 'Ethereum', symbol: 'eth', image: 'some/url/ethereum.png' },
            { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: 'some/url/bitcoin.png' },
            { id: 'tether', name: 'Tether', symbol: 'usdt', image: 'some/url/tether.png' },
        ]);
        expect(result.updatedToColumn).toBeUndefined();
    });

    it('moves a coin between different lists', () => {
        const fromList = mockUnwatchedCoins;
        const toList = mockWatchedCoins;
        const result = moveCoin('ripple', fromList, toList, UNWATCHED_COLUMN_ID, WATCHED_COLUMN_ID, 1, 0);

        expect(result.updatedFromColumn).toEqual([
            { id: 'solana', name: 'Solana', symbol: 'sol', image: 'some/url/solana.png' },
            { id: 'binancecoin', name: 'BNB', symbol: 'bnb', image: 'some/url/binancecoin.png' },
        ]);
        expect(result.updatedToColumn).toEqual([
            { id: 'ripple', name: 'XRP', symbol: 'xrp', image: 'some/url/ripple.png' },
            { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: 'some/url/bitcoin.png' },
            { id: 'ethereum', name: 'Ethereum', symbol: 'eth', image: 'some/url/ethereum.png' },
            { id: 'tether', name: 'Tether', symbol: 'usdt', image: 'some/url/tether.png' },
        ]);
    });

    it('throws an error if destinationIndex is undefined when moving between columns', () => {
        const fromList = mockUnwatchedCoins;
        const toList = mockWatchedCoins;

        expect(() =>
            moveCoin('1', fromList, toList, UNWATCHED_COLUMN_ID, WATCHED_COLUMN_ID)
        ).toThrow('destinationIndex is required when moving between columns');
    });

    it('does nothing if the coin is not found in the fromList', () => {
        const fromList = mockUnwatchedCoins;
        const toList = mockWatchedCoins;

        const result = moveCoin('dogecoin', fromList, toList, UNWATCHED_COLUMN_ID, WATCHED_COLUMN_ID, 0, 1);

        expect(result.updatedFromColumn).toEqual(fromList);
        expect(result.updatedToColumn).toEqual(toList);
    });

    it('handles invalid indices gracefully when reordering within the same list', () => {
        const fromList = mockWatchedCoins;

        const result = moveCoin('bitcoin', fromList, [], WATCHED_COLUMN_ID, WATCHED_COLUMN_ID, 1, 10);

        expect(result.updatedFromColumn).toEqual([
            { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: 'some/url/bitcoin.png' },        
            { id: 'tether', name: 'Tether', symbol: 'usdt', image: 'some/url/tether.png' },
            { id: 'ethereum', name: 'Ethereum', symbol: 'eth', image: 'some/url/ethereum.png' },
        ]);
    });
});
