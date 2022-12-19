import { ArcElement, Chart as ChartJS, Tooltip } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip);

function PieChart({ labels, data }) {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "# of Votes",
                data: data,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
        maintainAspectRatio: false,
        options: {
            responsive: true,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        },
    };
    return (
        <div className='flex flex-col justify-center items-center col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 w-full h-full'>
            <div style={{ height: "600px", position: "relative", width: "600px" }}>
                <Pie data={chartData} id='myPieChart' />
            </div>
        </div>
    );
}

export default PieChart;
