import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CryptoProvider } from '../../context/CryptoContext';
import { useCryptoContext } from '../useCryptoContext';

describe('CryptoContext', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useCryptoContext(), { wrapper: CryptoProvider });

    expect(result.current.unwatchedCoins).toEqual([]);
    expect(result.current.watchedCoins).toEqual([]);
    expect(result.current.priceHistory).toEqual({});
    expect(result.current.loadingCoinsList).toBe(true);
  });

  it('throws an error when used outside of the provider', () => {
    expect(() => renderHook(() => useCryptoContext())).toThrow(
      'useCrypto must be used within a CryptoProvider'
    );
  });
});
