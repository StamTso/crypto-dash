import { CryptoCoin } from "../services/types";

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
        updatedToColumn.splice(destinationIndex ?? 0, 0, movedCoin);
    }

    return { updatedFromColumn, updatedToColumn };
};


export const moveCoin = (
    coinId: string,
    fromColumn: CryptoCoin[],
    toColumn: CryptoCoin[],
    fromColumnId: string,
    toColumnId: string,
    sourceIndex?: number,
    destinationIndex?: number
): { updatedFromColumn: CryptoCoin[]; updatedToColumn?: CryptoCoin[] } => {

    if (fromColumnId === toColumnId && sourceIndex !== undefined && destinationIndex !== undefined) {
        const updatedColumn = moveWithinColumn(fromColumn, sourceIndex, destinationIndex);
        return { updatedFromColumn: updatedColumn };
    }

    return moveBetweenColumns(fromColumn, toColumn, coinId, destinationIndex ?? 0);
}