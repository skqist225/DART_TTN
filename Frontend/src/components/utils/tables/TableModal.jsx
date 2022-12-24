import { Spinner } from "flowbite-react";
import $ from "jquery";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { examState } from "../../../features/examSlice";
import { questionState } from "../../../features/questionSlice";
import { registerState } from "../../../features/registerSlice";
import { addTest, editTest, testState } from "../../../features/testSlice";
import { userState } from "../../../features/userSlice";
import { callToast } from "../../../helpers";
import { CloseIcon } from "../../../images";
import { tailwindCss } from "../../../tailwind";
import QuestionsViewer from "./QuestionsViewer";
import RegistersViewer from "./RegistersViewer";

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
    examPage = false,
}) {
    const dispatch = useDispatch();

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

    const { addTestDisabled, editedTest } = useSelector(testState);
    const {
        addExam: { loading: addExamLoading },
        editExam: { loading: editExamLoading },
    } = useSelector(examState);

    const disabled = false;

    return (
        <div
            id={modalId}
            tabIndex='-1'
            aria-hidden='true'
            className={tailwindCss.modal.container}
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
            <div className='relative w-full max-w-4xl h-full md:h-full mt-10'>
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
                        <button
                            type={
                                !excelAdd && !addTst
                                    ? "submit"
                                    : addTst && editedTest
                                    ? "submit"
                                    : "button"
                            }
                            className={`${tailwindCss.modal.saveButton} ${
                                disabled && "cursor-not-allowed bg-blue-300 hover:bg-blue-300"
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

                                    if (editedTest) {
                                        dispatch(
                                            editTest({
                                                id: $("#testId").val(),
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
                                    } else {
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
                                }
                            }}
                        >
                            {(modalLabel === "Thêm đăng ký" && registerLoading) ||
                                (modalLabel === "Thêm câu hỏi" && questionLoading) ||
                                (modalLabel === "Thêm người dùng" && userLoading && (
                                    <Spinner size='sm' light={true} className='mr-2' />
                                ))}
                            {modalLabel === "Thêm ca thi" && addExamLoading && (
                                <Spinner size='sm' light={true} className='mr-2' />
                            )}{" "}
                            {modalLabel === "Chỉnh sửa ca thi" && editExamLoading && (
                                <Spinner size='sm' light={true} className='mr-2' />
                            )}
                            {excelAdd ? "Thêm tất cả" : <span>{buttonLabel}</span>}
                        </button>
                        {addTst && (
                            <>
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
                                    Tải danh sách câu hỏi
                                </button>
                                <button
                                    type='button'
                                    onClick={() => {
                                        $(`#questionsListModalViewer`).css("display", "flex");
                                    }}
                                    style={{ maxWidth: "250px" }}
                                    className={`${tailwindCss.blueOutlineButton} `}
                                >
                                    Xem danh sách câu hỏi
                                </button>
                            </>
                        )}
                        {examPage && (
                            <button
                                type='button'
                                onClick={() => {
                                    $(`#registerModalViewerExamPage`).css("display", "flex");
                                }}
                                style={{ maxWidth: "250px" }}
                                className={`${tailwindCss.blueOutlineButton} `}
                            >
                                Xem danh sách đăng ký
                            </button>
                        )}
                    </div>
                </form>
                {examPage && <RegistersViewer />}
                {addTst && <QuestionsViewer />}
            </div>
        </div>
    );
}

export default TableModal;
