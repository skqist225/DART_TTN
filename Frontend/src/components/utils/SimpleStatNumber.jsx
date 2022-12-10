import React from "react";

function SimpleStatNumber({ label, number, backgroundColor }) {
    return (
        <div
            className={`flex flex-col col-span-full sm:col-span-6 xl:col-span-4 ${backgroundColor} shadow-lg rounded-sm border border-slate-200`}
            style={{
                width: "300px",
                height: "150px",
                borderRadius: "8px",
            }}
        >
            <div className='px-5 pt-5'>
                <h2 className='text-lg font-semibold text-gray-200 mb-2'>{label}</h2>
                <div className='flex items-start'>
                    <div className={`text-3xl font-bold text-gray-200 mr-2`}>{number}</div>
                </div>
            </div>
        </div>
    );
}

export default SimpleStatNumber;
