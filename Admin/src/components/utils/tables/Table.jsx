import React, { useState } from "react";
import TablePagination from "./TablePagination";
import TableHeader from "./TableHeader";
import TableModal from "./TableModal";
import TableSearch from "./TableSearch";
import { tailwindCss } from "../../../tailwind";
import $ from "jquery";
import { DropDownIcon, ExcelIcon } from "../../../images";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { questionState, setExcelAdd } from "../../../features/questionSlice";

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
    handleAddSelectedQuestionFromExcelFile,
    fetchDataByPageNumber,
}) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    return (
        <div className='overflow-x-auto relative shadow-md sm:rounded-lg overflow-y-auto'>
            <div className='flex items-center'>
                <TableSearch
                    placeHolder={searchPlaceHolder}
                    handleQueryChange={handleQueryChange}
                />

                {!["câu hỏi"].includes(modalLabel) ? (
                    <div className='mr-5'>
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
                ) : (
                    <div className='relative'>
                        <button
                            id='dropdownDefault'
                            data-dropdown-toggle='dropdown'
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                            type='button'
                            onClick={() => {
                                if (!open) {
                                    $("#dropdown").css("display", "block");
                                    setOpen(true);
                                } else {
                                    $("#dropdown").css("display", "none");
                                    setOpen(false);
                                }
                            }}
                            style={{ width: "170px" }}
                        >
                            Thêm {modalLabel}
                            <DropDownIcon />
                        </button>
                        <div id='dropdown' className={tailwindCss.dropdown.button}>
                            <ul
                                className='py-1 text-sm text-gray-700 dark:text-gray-200'
                                aria-labelledby='dropdownMenuIconButton'
                            >
                                <li
                                    className={tailwindCss.dropdown.li}
                                    onClick={() => {
                                        $("#" + modalId).css("display", "flex");
                                        setIsEdit(false);
                                    }}
                                >
                                    Thêm {modalLabel}
                                </li>
                                <li className='flex items-center align-middle'>
                                    <button
                                        type='button'
                                        className={tailwindCss.lightButton}
                                        onClick={() => {
                                            dispatch(setExcelAdd(true));
                                            $("#" + modalId).css("display", "flex");
                                        }}
                                    >
                                        <ExcelIcon />
                                        Thêm từ file Excel
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <TableHeader columns={columns} handleSortChange={handleSortChange} />
                {TableBody}
            </table>
            <TablePagination
                totalElements={totalElements}
                totalPages={totalPages}
                fetchDataByPageNumber={fetchDataByPageNumber}
            />

            <TableModal
                modalId={modalId}
                formId={formId}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                modalLabel={isEdit ? `Chỉnh sửa ${modalLabel}` : `Thêm ${modalLabel}`}
                ModalBody={ModalBody}
                buttonLabel={isEdit ? `Chỉnh sửa` : `Thêm`}
                setIsEdit={setIsEdit}
                handleAddSelectedQuestionFromExcelFile={handleAddSelectedQuestionFromExcelFile}
            />
        </div>
    );
}

export default Table;
