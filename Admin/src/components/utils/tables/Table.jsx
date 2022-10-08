import React from "react";
import TableBody from "./TableBody";
import TablePagination from "./TablePagination";
import TableHeader from "./TableHeader";
import TableModal from "./TableModal";
import TableSearch from "./TableSearch";

function Table({ columns, rows, totalElements, totalPages }) {
    return (
        <div class='overflow-x-auto relative shadow-md sm:rounded-lg'>
            <TableSearch placeHolder='Tìm kiếm theo tên và mã môn học' />
            <table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <TableHeader columns={columns} />
                <TableBody rows={rows} />
            </table>
            <TablePagination totalElements={totalElements} />

            <TableModal />
        </div>
    );
}

export default Table;
