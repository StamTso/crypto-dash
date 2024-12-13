export interface CryptoCoin {
    id: string;
    name: string;
    symbol: string;
    image: string;
}

export interface PriceData {
    eur: number;
    last_updated_at: number;
}