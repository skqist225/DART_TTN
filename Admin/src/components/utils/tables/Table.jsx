import React from "react";
import TablePagination from "./TablePagination";
import TableHeader from "./TableHeader";
import TableModal from "./TableModal";
import TableSearch from "./TableSearch";
import { tailwindCss } from "../../../tailwind";
import $ from "jquery";

function Table({
    searchPlaceHolder,
    handleQueryChange,
    modalId,
    setIsEdit,
    columns,
    TableBody,
    totalElements,
    totalPages,
    formId,
    handleSubmit,
    onSubmit,
    modalLabel,
    ModalBody,
    isEdit,
    handleSortChange,
}) {
    return (
        <div className='overflow-x-auto relative shadow-md sm:rounded-lg'>
            <div className='flex items-center'>
                <TableSearch
                    placeHolder={searchPlaceHolder}
                    handleQueryChange={handleQueryChange}
                />

                <div>
                    <button
                        type='button'
                        className={tailwindCss.button}
                        onClick={() => {
                            $("#" + modalId).css("display", "flex");
                            setIsEdit(false);
                        }}
                    >
                        Thêm {modalLabel}
                    </button>
                </div>
            </div>

            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <TableHeader columns={columns} handleSortChange={handleSortChange} />
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
