import { Divider } from "@mui/material";
import React from "react";

function SimpleStatNumber({
    label,
    number,
    backgroundColor,
    additionalData = [
        ["", 0],
        ["", 0],
        ["", 0],
        ["", 0],
    ],
}) {
    const [[label1, data1], [label2, data2], [label3, data3], [label4, data4]] = additionalData;

    return (
        <div
            className={`flex flex-col col-span-full sm:col-span-6 xl:col-span-4 ${backgroundColor} shadow-lg rounded-sm border border-slate-200 text-gray-200`}
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
            {additionalData && (
                <div className='flex items-center justify-between px-2'>
                    <div className='w-full col-flex items-center'>
                        <div className='text-sm font-semibold'>{label1}</div>{" "}
                        <div className='text-sm font-semibold'>{data1}</div>
                    </div>
                    <Divider orientation='vertical' style={{ backgroundColor: "white" }} />
                    <div className='flex-col w-full flex justify-end items-center'>
                        <div className='text-sm font-semibold'>{label2}</div>{" "}
                        <div className='text-sm font-semibold'>{data2}</div>
                    </div>{" "}
                    {label3 && (
                        <>
                            <Divider orientation='vertical' style={{ backgroundColor: "white" }} />
                            <div className='flex-col w-full flex justify-end items-center'>
                                <div className='text-sm font-semibold'>{label3}</div>{" "}
                                <div className='text-sm font-semibold'>{data3}</div>
                            </div>
                        </>
                    )}{" "}
                    {label4 && (
                        <>
                            <Divider orientation='vertical' style={{ backgroundColor: "white" }} />
                            <div className='flex-col w-full flex justify-end items-center'>
                                <div className='text-sm font-semibold'>{label4}</div>{" "}
                                <div className='text-sm font-semibold'>{data4}</div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default SimpleStatNumber;
