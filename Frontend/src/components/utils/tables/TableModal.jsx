import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import { CloseIcon } from "../../../images";
import { tailwindCss } from "../../../tailwind";
import { questionState } from "../../../features/questionSlice";
import { addTest, testState } from "../../../features/testSlice";
import { callToast } from "../../../helpers";
import { userState } from "../../../features/userSlice";
import { examState } from "../../../features/examSlice";
import { registerState } from "../../../features/registerSlice";
import $ from "jquery";

function TableModal({
    modalId,
    formId,
    handleSubmit,
    onSubmit,
    modalLabel,
    ModalBody,
    buttonLabel,
    setIsEdit,
    onCloseForm,
    handleAddMultipleFromExcelFile,
    setError,
    addTest: addTst = false,
    excelAdd = false,
    testPage = false,
}) {
    const dispatch = useDispatch();
    const { editedTest } = useSelector(testState);

    const {
        questions,
        addMultipleQuestions: { loading: questionLoading },
    } = useSelector(questionState);
    const {
        addMultipleUsers: { loading: userLoading },
    } = useSelector(userState);
    const {
        addMultipleRegisters: { loading: registerLoading },
    } = useSelector(registerState);
    const { addTestDisabled } = useSelector(testState);
    const {
        addExamDisabled,
        addExam: { loading: addExamLoading },
    } = useSelector(examState);

    const disabled =
        (modalLabel === "đề thi" && addTestDisabled) ||
        (modalLabel === "Thêm ca thi" && !addExamDisabled);

    return (
        <div
            id={modalId}
            tabIndex='-1'
            aria-hidden='true'
            className={tailwindCss.modal.container}
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
            <div className='relative w-full max-w-5xl h-full md:h-full mt-10'>
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
                                $(`#${modalId}`).css("display", "none");
                                setIsEdit(false);
                                onCloseForm();
                            }}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                    <div className='p-4 space-y-6'>{ModalBody}</div>

                    <div className='flex items-center p-4 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600'>
                        {addTst && (
                            <button
                                id='loadQuestionTestPageButton'
                                type='submit'
                                className={`${tailwindCss.blueOutlineButton} ${
                                    modalLabel === "đề thi" &&
                                    addTestDisabled &&
                                    "cursor-not-allowed hover:text-blue-700 hover:bg-white"
                                }`}
                                disabled={modalLabel === "đề thi" && addTestDisabled}
                            >
                                Tải câu hỏi
                            </button>
                        )}

                        <button
                            type={
                                !excelAdd && !addTst
                                    ? "submit"
                                    : addTst && editedTest
                                    ? "submit"
                                    : "button"
                            }
                            className={`${tailwindCss.modal.saveButton} ${
                                disabled && "cursor-not-allowed hover:bg-blue-700"
                            }`}
                            disabled={disabled}
                            onClick={() => {
                                if (excelAdd && handleAddMultipleFromExcelFile) {
                                    handleAddMultipleFromExcelFile();
                                }

                                if (addTst) {
                                    let haveError = false;
                                    const name = $("#testName").val();
                                    if (!name) {
                                        if (setError) {
                                            setError("testName", {
                                                type: "custom",
                                                message: "Tên đề thi không được để trống",
                                            });
                                        } else {
                                            callToast("error", "Tên đề thi không được để trống");
                                        }
                                        haveError = true;
                                    }

                                    if (!questions.length) {
                                        callToast("error", "Danh sách câu hỏi không được để trống");
                                        haveError = true;
                                    }

                                    if (haveError) {
                                        return;
                                    }

                                    dispatch(
                                        addTest({
                                            name,
                                            subjectId: $("#testSubjectId").val(),
                                            questions: questions.map(question => ({
                                                ...question,
                                                level:
                                                    question.level === "Dễ "
                                                        ? "EASY"
                                                        : question.level === "Trung bình"
                                                        ? "MEDIUM"
                                                        : "HARD",
                                            })),
                                        })
                                    );
                                }
                            }}
                        >
                            {(modalLabel === "Thêm đăng ký" && registerLoading) ||
                                (modalLabel === "Thêm câu hỏi" && questionLoading) ||
                                (modalLabel === "Thêm người dùng" && userLoading && (
                                    <Spinner size='sm' light={true} />
                                ))}
                            {modalLabel === "Thêm ca thi" && addExamLoading && (
                                <Spinner size='sm' light={true} />
                            )}
                            {excelAdd ? "Thêm tất cả" : buttonLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TableModal;
