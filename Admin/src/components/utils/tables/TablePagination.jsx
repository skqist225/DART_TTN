import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { questionState, setResetFilter } from "../../../features/questionSlice";

function TablePagination({ totalElements, totalPages, setPage, fetchDataByPageNumber }) {
    const dispatch = useDispatch();
    const [currentIndex, setCurrentIndex] = useState(1);
    const { resetFilter, excelAdd } = useSelector(questionState);

    useEffect(() => {
        if (resetFilter) {
            setCurrentIndex(1);
        }
    }, [resetFilter]);

    useEffect(() => {
        if (currentIndex == 1) {
            dispatch(setResetFilter(false));
        }
    }, [currentIndex]);

    return (
        <nav className='col-flex justify-between items-center pt-4' aria-label='Table navigation'>
            <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
                Hiển thị{" "}
                <span className='font-semibold text-gray-900 dark:text-white'>
                    {(currentIndex - 1) * 10 + 1}-{currentIndex * 10}
                </span>{" "}
                của{" "}
                <span className='font-semibold text-gray-900 dark:text-white'>{totalElements}</span>
            </span>
            <ul className='inline-flex items-center -space-x-px'>
                <li>
                    <button
                        className='rounded-l-lg py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                        onClick={e => {
                            if (currentIndex > 1) {
                                if (excelAdd && setPage) {
                                    setPage(currentIndex - 1);
                                } else {
                                    fetchDataByPageNumber(currentIndex - 1);
                                }
                                setCurrentIndex(currentIndex - 1);
                            }
                        }}
                    >
                        <span className='sr-only'>Previous</span>
                        <svg
                            className='w-5 h-5'
                            aria-hidden='true'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                fillRule='evenodd'
                                d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                                clipRule='evenodd'
                            ></path>
                        </svg>
                    </button>
                </li>
                {Array.from({ length: totalPages }).map((page, index) => (
                    <li key={index + 1}>
                        <button
                            className='py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white '
                            onClick={e => {
                                if (excelAdd && setPage) {
                                    setPage(index + 1);
                                } else {
                                    fetchDataByPageNumber(index + 1);
                                }
                                setCurrentIndex(index + 1);
                            }}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        className='rounded-r-lg py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                        onClick={e => {
                            if (currentIndex < totalPages) {
                                if (excelAdd && setPage) {
                                    setPage(currentIndex + 1);
                                } else {
                                    fetchDataByPageNumber(currentIndex + 1);
                                }
                                setCurrentIndex(currentIndex + 1);
                            }
                        }}
                    >
                        <span className='sr-only'>Next</span>
                        <svg
                            className='w-5 h-5'
                            aria-hidden='true'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                fillRule='evenodd'
                                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                                clipRule='evenodd'
                            ></path>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default TablePagination;
