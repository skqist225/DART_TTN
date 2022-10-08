import React from "react";
import { useDispatch } from "react-redux";

function TableSearch({ placeHolder, handleQueryChange }) {
    return (
        <div className='flex justify-between items-center py-4 bg-white dark:bg-gray-800'>
            <label for='table-search' className='sr-only'>
                Search
            </label>
            <div className='relative mx-5'>
                <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                    <svg
                        className='w-5 h-5 text-gray-500 dark:text-gray-400'
                        aria-hidden='true'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            fill-rule='evenodd'
                            d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                            clip-rule='evenodd'
                        ></path>
                    </svg>
                </div>
                <input
                    type='text'
                    id='table-search-users'
                    className='block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder={placeHolder}
                    onChange={handleQueryChange}
                />
            </div>
        </div>
    );
}

export default TableSearch;
