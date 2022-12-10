import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "flowbite-react";
import TablePagination from "./TablePagination";
import TableHeader from "./TableHeader";
import TableModal from "./TableModal";
import TableSearch from "./TableSearch";
import { tailwindCss } from "../../../tailwind";
import { ExcelIcon } from "../../../images";
import { setExcelAdd } from "../../../features/questionSlice";
import { persistUserState } from "../../../features/persistUserSlice";
import { setUserExcelAdd } from "../../../features/userSlice";
import MyButton, { ButtonType } from "../../common/MyButton";
import { setRegisterExcelAdd } from "../../../features/registerSlice";
import { takeExamState } from "../../../features/takeExamSlice";
import $ from "jquery";

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
    loading = false,
    testPage = false,
    recordsPerPage = 12,
    ranksPage = false,
    setError,
}) {
    const dispatch = useDispatch();

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const { studentRankingPosition } = useSelector(takeExamState);

    return (
        <div
            className='overflow-x-auto relative shadow-md sm:rounded-lg overflow-y-auto flex flex-col justify-between'
            style={{ minHeight: "calc(100vh - 64px)" }}
        >
            <div>
                <div className='flex items-center justify-between bg-white'>
                    <div className='flex items-center'>
                        {!ranksPage && (
                            <TableSearch
                                placeHolder={searchPlaceHolder}
                                handleQueryChange={handleQueryChange}
                            />
                        )}
                        {Filter && <Filter />}
                    </div>
                    <div
                        className='flex items-center
                    '
                    >
                        {(modalLabel === "môn học" &&
                            !user.roles.map(({ name }) => name).includes("Quản trị viên")) ||
                        (modalLabel === "lớp tín chỉ" &&
                            !user.roles.map(({ name }) => name).includes("Quản trị viên")) ||
                        (modalLabel === "ca thi" &&
                            user.roles.map(({ name }) => name).includes("Sinh viên")) ||
                        modalLabel === "Bảng xếp hạng" ? (
                            <></>
                        ) : (
                            <div className='mr-2'>
                                <MyButton
                                    type={ButtonType.add}
                                    index='last'
                                    label={modalLabel}
                                    onClick={() => {
                                        $(`#${modalId}`).css("display", "flex");
                                        setIsEdit(false);
                                    }}
                                    className='px-2 py-2 rounded-lg'
                                />
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

                {loading ? (
                    <div
                        className='flex items-center justify-center w-full'
                        style={{ height: "calc(100vh - 150px)" }}
                    >
                        Đang tải...
                    </div>
                ) : (
                    <>
                        {rows.length > 0 ? (
                            <>
                                {ranksPage && userRoles.includes("Sinh viên") && (
                                    <Card>
                                        <p className='font-normal text-gray-700 dark:text-gray-400'>
                                            Vị trí của bạn trong bảng xếp hạng là:
                                            <span className='font-bold'>
                                                {" "}
                                                {studentRankingPosition}
                                            </span>
                                        </p>
                                    </Card>
                                )}

                                <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                    <TableHeader
                                        columns={columns}
                                        handleSortChange={handleSortChange}
                                        modalLabel={modalLabel}
                                    />
                                    <TableBody rows={rows} setIsEdit={setIsEdit} />{" "}
                                </table>
                            </>
                        ) : (
                            <>
                                {!loading && (
                                    <div
                                        className={`text-blue-600 uppercase flex items-center justify-center w-full`}
                                        style={{ height: "calc(100vh - 150px)" }}
                                    >
                                        <div className='border-2 border-gray-400 rounded-lg p-4'>{`Danh sách ${modalLabel} trống`}</div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
            {rows.length > 0 && (
                <TablePagination
                    totalElements={totalElements}
                    totalPages={totalPages}
                    fetchDataByPageNumber={fetchDataByPageNumber}
                    recordsPerPage={recordsPerPage}
                />
            )}

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
                testPage={testPage}
                setError={setError}
            />
        </div>
    );
}

export default Table;
