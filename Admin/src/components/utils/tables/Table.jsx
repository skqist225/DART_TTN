import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "./TablePagination";
import TableHeader from "./TableHeader";
import TableModal from "./TableModal";
import TableSearch from "./TableSearch";
import { tailwindCss } from "../../../tailwind";
import { ExcelIcon } from "../../../images";
import { setExcelAdd } from "../../../features/questionSlice";
import { persistUserState } from "../../../features/persistUserSlice";
import { setUserExcelAdd } from "../../../features/userSlice";
import { Tooltip } from "flowbite-react";
import MyButton, { ButtonType } from "../../common/MyButton";
import $ from "jquery";
import { setRegisterExcelAdd } from "../../../features/registerSlice";

function Table({
    searchPlaceHolder,
    handleQueryChange,
    modalId,
    setIsEdit,
    columns,
    rows,
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
    handleAddMultipleFromExcelFile,
    fetchDataByPageNumber,
    addTest,
    onCloseForm,
    Filter,
    excelAdd,
    recordsPerPage = 12,
}) {
    const dispatch = useDispatch();

    const { userRoles } = useSelector(persistUserState);

    return (
        <div
            className='overflow-x-auto relative shadow-md sm:rounded-lg overflow-y-auto flex flex-col justify-between'
            style={{ minHeight: "calc(100vh - 64px)" }}
        >
            <div>
                <div className='flex items-center justify-between bg-white'>
                    <div className='flex items-center'>
                        <TableSearch
                            placeHolder={searchPlaceHolder}
                            handleQueryChange={handleQueryChange}
                        />
                        {Filter && <Filter />}
                    </div>
                    <div
                        className='flex items-center
                    '
                    >
                        {(modalLabel === "môn học" && !userRoles.includes("Quản trị viên")) ||
                        (modalLabel === "ca thi" && userRoles.includes("Sinh viên")) ? (
                            <></>
                        ) : (
                            <div className='mr-2'>
                                <Tooltip
                                    placement='left'
                                    animation='duration-200'
                                    style='dark'
                                    content={<span>Thêm {modalLabel}</span>}
                                >
                                    <MyButton
                                        type={ButtonType.add}
                                        onClick={() => {
                                            $(`#${modalId}`).css("display", "flex");
                                            setIsEdit(false);
                                        }}
                                        className='px-2 py-2 rounded-lg'
                                    />
                                </Tooltip>
                            </div>
                        )}
                        {["câu hỏi", "đăng ký", "người dùng"].includes(modalLabel) && (
                            <div className='mr-2'>
                                <button
                                    type='button'
                                    className={
                                        tailwindCss.lightButton + " bg-gray-200 hover:bg-gray-300"
                                    }
                                    onClick={() => {
                                        if (modalLabel === "câu hỏi") {
                                            dispatch(setExcelAdd(true));
                                        } else if (modalLabel === "đăng ký") {
                                            dispatch(setRegisterExcelAdd(true));
                                        } else if (modalLabel === "người dùng") {
                                            dispatch(setUserExcelAdd(true));
                                        }
                                        $(`#${modalId}`).css("display", "flex");
                                    }}
                                    style={{ width: "46px", height: "46px" }}
                                >
                                    <ExcelIcon />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                    <TableHeader
                        columns={columns}
                        handleSortChange={handleSortChange}
                        modalLabel={modalLabel}
                    />
                    <TableBody rows={rows} setIsEdit={setIsEdit} />
                </table>
            </div>
            <TablePagination
                totalElements={totalElements}
                totalPages={totalPages}
                fetchDataByPageNumber={fetchDataByPageNumber}
                recordsPerPage={recordsPerPage}
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
                handleAddMultipleFromExcelFile={handleAddMultipleFromExcelFile}
                addTest={addTest}
                onCloseForm={onCloseForm}
                excelAdd={excelAdd}
            />
        </div>
    );
}

export default Table;
