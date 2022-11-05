import React from "react";
import { CloseIcon } from "../../../images";
import { tailwindCss } from "../../../tailwind";
import $ from "jquery";
import { useSelector } from "react-redux";
import {
    questionState,
    resetLoadedQuestions,
    setEditedQuestion,
    setExcelAdd,
} from "../../../features/questionSlice";
import { useDispatch } from "react-redux";
import { addTest } from "../../../features/testSlice";
import { callToast } from "../../../helpers";

function TableModal({
    modalId,
    formId,
    handleSubmit,
    onSubmit,
    modalLabel,
    ModalBody,
    buttonLabel,
    setIsEdit,
    handleAddSelectedQuestionFromExcelFile,
    addTest: addTst = false,
}) {
    const dispatch = useDispatch();
    const { excelAdd, questions } = useSelector(questionState);

    return (
        <div
            id={modalId}
            tabIndex='-1'
            aria-hidden='true'
            className={tailwindCss.modal.container}
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
            <div className='relative w-full max-w-4xl h-full md:h-full mt-24'>
                <form
                    id={formId}
                    onSubmit={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubmit(onSubmit)(e);
                    }}
                    className='relative bg-white rounded-lg shadow dark:bg-gray-700'
                >
                    <div className={tailwindCss.modal.body}>
                        <h3 className={tailwindCss.modal.title}>{modalLabel}</h3>
                        <button
                            type='button'
                            className={tailwindCss.modal.closeButton}
                            data-modal-toggle={modalId}
                            onClick={() => {
                                $("#" + modalId).css("display", "none");
                                setIsEdit(false);
                                dispatch(setExcelAdd(false));
                                dispatch(setEditedQuestion(null));
                                dispatch(resetLoadedQuestions());
                            }}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                    <div className='p-6 space-y-6'>{ModalBody}</div>

                    <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600'>
                        {addTst && (
                            <>
                                <button
                                    type='submit'
                                    className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800'
                                >
                                    Tải câu hỏi
                                </button>
                            </>
                        )}
                        <button
                            type={!excelAdd && !addTst ? "submit" : "button"}
                            className={tailwindCss.modal.saveButton}
                            onClick={() => {
                                if (excelAdd && handleAddSelectedQuestionFromExcelFile) {
                                    handleAddSelectedQuestionFromExcelFile();
                                }
                                if (addTst) {
                                    if (!$("#testName").val()) {
                                        callToast("error", "Tên bộ đề không được để trống");
                                        return;
                                    } else {
                                        const name = $("#testName").val();
                                        const subjectId = $("#testSubjectId").val();
                                        if (!questions.length) {
                                            callToast(
                                                "error",
                                                "Danh sách câu hỏi không được để trống"
                                            );
                                            return;
                                        }
                                        let criteria = [];

                                        for (let i = 0; i <= 999; i++) {
                                            const chapter = $(`#criteria.${i}.chapter`).val();
                                            const level = $(`#criteria.${i}.level`).val();
                                            const numberOfQuestions = $(
                                                `#criteria.${i}.numberOfQuestions`
                                            ).val();
                                            if (!chapter) {
                                                break;
                                            }
                                            criteria.push({
                                                chapter,
                                                level,
                                                numberOfQuestions,
                                            });
                                        }

                                        console.log(criteria);

                                        dispatch(addTest({ name, subjectId, questions, criteria }));
                                    }
                                }
                            }}
                        >
                            {excelAdd && excelAdd === true ? "Thêm tất cả" : buttonLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TableModal;
