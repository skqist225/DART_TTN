import React from "react";
import { tailwindConfig } from "../../utils/Utils";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StackedBarChart({ data, labels }) {
    const [dataSet1, dataSet2] = data;

    const options = {
        plugins: {
            title: {
                display: true,
                text: "Chart.js Bar Chart - Stacked",
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const chartData = {
        labels,
        datasets: [
            {
                label: "Chưa sử dụng",
                data: dataSet1,
                backgroundColor: tailwindConfig().theme.colors.green[500],
                hoverBackgroundColor: tailwindConfig().theme.colors.green[600],
                barPercentage: 0.66,
                categoryPercentage: 0.66,
            },
            {
                label: "Đã sử dụng",
                data: dataSet2,
                backgroundColor: tailwindConfig().theme.colors.blue[500],
                hoverBackgroundColor: tailwindConfig().theme.colors.blue[600],
                barPercentage: 0.66,
                categoryPercentage: 0.66,
            },
        ],
    };

    return (
        <div className='flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200'>
            <header className='px-5 py-4 border-b border-slate-100 flex items-center'>
                <h2 className='font-semibold text-slate-800'>Trạng thái đề thi theo môn học</h2>
            </header>
            <div className='grow'>
                <Bar options={options} data={chartData} />
            </div>
        </div>
    );
}

export default StackedBarChart;
