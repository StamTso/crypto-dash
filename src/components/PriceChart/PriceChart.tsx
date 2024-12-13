import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
} from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend);

interface PriceChartProps {
    priceHistory: { price: number; last_updated_at: number }[];
}

const PriceChart: React.FC<PriceChartProps> = ({ priceHistory }) => {
    if (!priceHistory.length) return null;

    const chartData = {
        labels: priceHistory.map((entry) =>
            new Date(entry.last_updated_at * 1000).toLocaleTimeString()
        ),
        datasets: [
            {
                data: priceHistory.map((entry) => entry.price),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                title: {
                    display: false
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Price (EUR)',
                },
                beginAtZero: false,
            },
        },
    };

    return <Line data={chartData} options={chartOptions} />;
};

export default PriceChart;
