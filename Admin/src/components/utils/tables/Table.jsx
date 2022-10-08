import React from "react";
import TablePagination from "./TablePagination";
import TableHeader from "./TableHeader";
import TableModal from "./TableModal";
import TableSearch from "./TableSearch";
import { tailwindCss } from "../../../tailwind";
import $ from "jquery";

function Table({
    handleQueryChange,
    columns,
    TableBody,
    totalElements,
    totalPages,
    modalId,
    formId,
    modalLabel,
    ModalBody,
    handleSubmit,
    onSubmit,
    isEdit,
    setIsEdit,
}) {
    return (
        <div className='overflow-x-auto relative shadow-md sm:rounded-lg'>
            <div className='flex items-center'>
                <TableSearch
                    placeHolder='Tìm kiếm theo tên và mã môn học'
                    handleQueryChange={handleQueryChange}
                />

                <div>
                    <button
                        type='button'
                        className={tailwindCss.button}
                        onClick={() => {
                            console.log("clicked");
                            $("#" + modalId).css("display", "flex");
                            setIsEdit(false);
                        }}
                    >
                        Thêm môn học
                    </button>
                </div>
            </div>

            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <TableHeader columns={columns} />
                {TableBody}
            </table>
            <TablePagination totalElements={totalElements} totalPages={totalPages} />

            <TableModal
                modalId={modalId}
                formId={formId}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                modalLabel={isEdit ? `Chỉnh sửa ${modalLabel}` : `Thêm ${modalLabel}`}
                ModalBody={ModalBody}
                buttonLabel={isEdit ? `Chỉnh sửa` : `Thêm`}
                setIsEdit={setIsEdit}
            />
        </div>
    );
}

export default Table;
