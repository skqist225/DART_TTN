import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "flowbite-react";
import { questionState, setResetFilter } from "../../../features/questionSlice";

function TablePagination({
    totalElements,
    totalPages,
    setPage,
    fetchDataByPageNumber,
    recordsPerPage = 10,
}) {
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
        <nav className='col-flex justify-between items-center my-5' aria-label='Table navigation'>
            <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
                Hiển thị{" "}
                <span className='font-semibold text-gray-900 dark:text-white'>
                    {(currentIndex - 1) * recordsPerPage + 1}-{currentIndex * recordsPerPage}
                </span>{" "}
                của{" "}
                <span className='font-semibold text-gray-900 dark:text-white'>{totalElements}</span>
            </span>
            <Pagination
                currentPage={currentIndex}
                layout='pagination'
                onPageChange={data => {
                    if (excelAdd && setPage) {
                        setPage(data);
                    } else {
                        fetchDataByPageNumber(data);
                    }
                    setCurrentIndex(data);
                }}
                showIcons={true}
                totalPages={totalPages}
                previousLabel='Trang trước'
                nextLabel='Trang sau'
            />
        </nav>
    );
}

export default TablePagination;
