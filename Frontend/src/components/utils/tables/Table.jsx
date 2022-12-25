import { Card } from "flowbite-react";
import $ from "jquery";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { creditClassState } from "../../../features/creditClassSlice";
import { persistUserState } from "../../../features/persistUserSlice";
import { setExcelAdd } from "../../../features/questionSlice";
import { setRegisterExcelAdd } from "../../../features/registerSlice";
import { takeExamState } from "../../../features/takeExamSlice";
import { setUserExcelAdd } from "../../../features/userSlice";
import { ExcelIcon } from "../../../images";
import { tailwindCss } from "../../../tailwind";
import MyButton, { ButtonType } from "../../common/MyButton";
import TableHeader from "./TableHeader";
import TableModal from "./TableModal";
import TablePagination from "./TablePagination";
import TableSearch from "./TableSearch";

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
    setValue,
    examPage,
}) {
    const dispatch = useDispatch();

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const { studentRankingPosition } = useSelector(takeExamState);
    const { creditClassesForExamAdded: creditClasses } = useSelector(creditClassState);

    let addButtonDisbaled = false,
        addButtonDisabledMessage = "";
    if (modalLabel === "ca thi" && creditClasses.length === 0) {
        addButtonDisbaled = true;
        addButtonDisabledMessage = "Không có lớp tín chỉ nào cần tạo ca thi";
    }

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

                        {Filter && <Filter setValue={setValue} />}
                    </div>
                    <div
                        className='flex items-center
                    '
                    >
                        {(modalLabel === "môn học" && !userRoles.includes("Quản trị viên")) ||
                        (modalLabel === "lớp tín chỉ" && !userRoles.includes("Quản trị viên")) ||
                        (modalLabel === "ca thi" && userRoles.includes("Sinh viên")) ||
                        (modalLabel === "ca thi" && !userRoles.includes("Quản trị viên")) ||
                        modalLabel === "bài thi đã làm" ||
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
                                    disabled={addButtonDisbaled}
                                    customTooltipMessage={addButtonDisabledMessage}
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
                        <div className='flex justify-center items-center space-x-2'>
                            <div
                                className='spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-blue-600'
                                role='status'
                            >
                                <span className='visually-hidden'>Loading...</span>
                            </div>
                            <div
                                className='
      spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0
        text-purple-500
      '
                                role='status'
                            >
                                <span className='visually-hidden'>Loading...</span>
                            </div>
                            <div
                                className='
      spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0
        text-green-500
      '
                                role='status'
                            >
                                <span className='visually-hidden'>Loading...</span>
                            </div>
                            <div
                                className='spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-red-500'
                                role='status'
                            >
                                <span className='visually-hidden'>Loading...</span>
                            </div>
                            <div
                                className='
      spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0
        text-yellow-500
      '
                                role='status'
                            >
                                <span className='visually-hidden'>Loading...</span>
                            </div>
                            <div
                                className='spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-blue-300'
                                role='status'
                            >
                                <span className='visually-hidden'>Loading...</span>
                            </div>
                            <div
                                className='spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-gray-300'
                                role='status'
                            >
                                <span className='visually-hidden'>Loading...</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {!loading && rows.length > 0 ? (
                            <>
                                {ranksPage &&
                                    userRoles.includes("Sinh viên") &&
                                    parseInt(studentRankingPosition) !== 0 && (
                                        <div className='mb-3'>
                                            <Card>
                                                <p className='font-normal text-gray-700 dark:text-gray-400'>
                                                    Vị trí của bạn trong bảng xếp hạng là:{" "}
                                                    <span className='font-bold text-lg'>
                                                        {studentRankingPosition}
                                                    </span>
                                                </p>
                                            </Card>
                                        </div>
                                    )}

                                <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                    <TableHeader
                                        columns={columns}
                                        handleSortChange={handleSortChange}
                                        modalLabel={modalLabel}
                                    />
                                    <TableBody rows={rows} setIsEdit={setIsEdit} />
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
                examPage={examPage}
            />
        </div>
    );
}

export default Table;
