import PriceChart from "../../components/PriceChart/PriceChart";

interface BoardItemProps {
    name: string;
    imageUrl?: string;
    priceHistory?: { price: number; last_updated_at: number }[];
    isLoading?: boolean;
}

const BoardItem: React.FC<BoardItemProps> = ({ name, imageUrl, priceHistory, isLoading = false }) => {
    return (
        <div className="flex flex-col items-center justify-evenly bg-white shadow rounded p-4 w-full h-30">
            <div className="flex items-center space-x-4">
                <img src={imageUrl} alt={name} className="w-12 h-12 rounded-full" />
                <span className="text-lg font-medium">{name}</span>
            </div>
            {isLoading ? (
                <p className="text-sm text-gray-500">Fetching Prices...</p>
            ) : (priceHistory && priceHistory.length > 0 && (
                <div className="w-1/2">
                    <PriceChart priceHistory={priceHistory} />
                </div>
            ))}
        </div>
    );
};

export default BoardItem;