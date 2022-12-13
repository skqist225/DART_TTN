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

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "Thống kê số câu hỏi còn sử dụng theo môn học",
        },
    },
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

function BarChart({ data, title = "", Filter }) {
    return (
        <>
            <div className='flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 w-full'>
                <header className='px-5 py-4 border-b border-slate-100 flex items-center'>
                    <h2 className='font-semibold text-slate-800'>{title}</h2>
                </header>
                <div className='w-3/6 mb-5 m-auto'>{Filter}</div>
                <Bar options={options} data={data} />
            </div>
        </>
    );
}

export default BarChart;
