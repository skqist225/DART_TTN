import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";
import { tailwindConfig } from "../../utils/Utils";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StackedBarChart({ data, labels, title = "", legends, Filter }) {
    const [dataSet1, dataSet2, dataSet3] = data;

    const options = {
        plugins: {
            title: {
                display: true,
                text: title,
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
        maintainAspectRatio: false,
    };

    const chartData = {
        labels,
        datasets: [
            {
                label: legends[0],
                data: dataSet2,
                backgroundColor: tailwindConfig().theme.colors.green[500],
                hoverBackgroundColor: tailwindConfig().theme.colors.green[600],
                barPercentage: 0.66,
                categoryPercentage: 0.66,
            },
            {
                label: legends[1],
                data: dataSet1,
                backgroundColor: tailwindConfig().theme.colors.blue[500],
                hoverBackgroundColor: tailwindConfig().theme.colors.blue[600],
                barPercentage: 0.66,
                categoryPercentage: 0.66,
            },
            {
                label: legends[2],
                data: dataSet3,
                backgroundColor: tailwindConfig().theme.colors.red[500],
                hoverBackgroundColor: tailwindConfig().theme.colors.red[600],
                barPercentage: 0.66,
                categoryPercentage: 0.66,
            },
        ],
    };

    return (
        <div className='flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 w-full h-full'>
            <header className='px-5 py-4 border-b border-slate-100 flex items-center'>
                <h2 className='font-semibold text-slate-800'>{title}</h2>
            </header>
            <div className='w-3/6 mb-5 m-auto'>{Filter}</div>
            <div style={{ height: "320px" }}>
                <Bar options={options} data={chartData} id='myStackedBarChart' />
            </div>
        </div>
    );
}

export default StackedBarChart;
