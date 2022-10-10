import React from "react";

function TablePagination({ totalElements, totalPages }) {
    return (
        <nav class='col-flex justify-between items-center pt-4' aria-label='Table navigation'>
            <span class='text-sm font-normal text-gray-500 dark:text-gray-400'>
                Showing <span class='font-semibold text-gray-900 dark:text-white'>1-10</span> of{" "}
                <span class='font-semibold text-gray-900 dark:text-white'>{totalElements}</span>
            </span>
            <ul class='inline-flex items-center -space-x-px'>
                <li>
                    <a
                        href='#'
                        class='block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                        <span class='sr-only'>Previous</span>
                        <svg
                            class='w-5 h-5'
                            aria-hidden='true'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                fill-rule='evenodd'
                                d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                    </a>
                </li>
                {Array.from({ length: totalPages }).map((page, index) => (
                    <li key={index + 1}>
                        <a
                            href='#'
                            class='py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                        >
                            {index + 1}
                        </a>
                    </li>
                ))}
                <li>
                    <a
                        href='#'
                        class='block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                        <span class='sr-only'>Next</span>
                        <svg
                            class='w-5 h-5'
                            aria-hidden='true'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                fill-rule='evenodd'
                                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default TablePagination;