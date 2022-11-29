import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
    Frame,
    QuestionModalBody,
    QuestionsFilter,
    QuestionTableBody,
    Table,
} from "../../components";
import { questionSchema } from "../../validation";
import { callToast } from "../../helpers";
import {
    addQuestion,
    editQuestion,
    questionState,
    clearQuestionState,
    fetchAllQuestions,
    addMultipleQuestions,
    setExcelAdd,
    setEditedQuestion,
} from "../../features/questionSlice";
import { fetchAllSubjects } from "../../features/subjectSlice";
import { questionColumns } from "../columns";
import $ from "jquery";

const Type = {
    oneAnswer: "Một đáp án",
    multipleAnswer: "Nhiều đáp án",
    typedAnswer: "Đáp án điền",
};

function QuestionsPage() {
    const dispatch = useDispatch();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);

    const {
        questions,
        questionsExcel,
        errorObject,
        totalElements,
        totalPages,
        filterObject,
        excelAdd,
        addQuestion: { successMessage },
        editQuestion: { successMessage: eqSuccessMessage },
        deleteQuestion: { successMessage: dqSuccessMessage, errorMessage: dqErrorMessage },
        addMultipleQuestions: { successMessage: amqSuccessMessage },
        enableOrDisableQuestion: { successMessage: eodqSuccessMessage },
    } = useSelector(questionState);

    const formId = "questionForm";
    const modalId = "questionModal";
    const modalLabel = "câu hỏi";

    useEffect(() => {
        dispatch(
            fetchAllQuestions({
                page: 1,
            })
        );
        dispatch(fetchAllSubjects({ page: 0, haveChapter: true }));
    }, []);

    const {
        register,
        setValue,
        handleSubmit,
        control,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(questionSchema),
        defaultValues: {
            answers: [],
        },
    });

    const onSubmit = data => {
        const { answers, type, typedAnswer, typedId } = data;
        const formData = new FormData();

        if (type === Type.typedAnswer) {
            if (!typedAnswer) {
                setError("typedAnswer", {
                    type: "custom",
                    message: "Đáp án điền không được để trống",
                });
                return;
            }
        } else {
            if (answers.length === 0) {
                callToast("warning", "Thêm lựa chọn");
                return;
            } else {
                if (answers.some(({ content }) => !content)) {
                    const emptyAnswers = [];
                    answers.forEach(({ content, name }) => {
                        if (!content) emptyAnswers.push(name);
                    });

                    callToast("error", `Điền nội dung cho lựa chọn ${emptyAnswers.join(",")}`);
                    return;
                } else if (answers.length === 1 && type === Type.oneAnswer) {
                    callToast("error", "Một câu hỏi có ít nhất 2 lựa chọn");
                    return;
                } else {
                    if (type === Type.oneAnswer) {
                        // One choice questions.
                        if (!answers.some(({ isAnswer }) => isAnswer)) {
                            callToast("error", "Chọn ít nhất 1 đáp án cho câu hỏi có một đáp án");
                            return;
                        }
                    } else {
                        // Multiple choices question.
                        let i = 0;
                        answers.forEach(({ isAnswer }) => {
                            if (isAnswer) {
                                i++;
                            }
                        });

                        if (i < 2) {
                            callToast("error", "Chọn ít nhất 2 đáp án cho câu hỏi có nhiều đáp án");
                            return;
                        }
                    }
                }
            }
        }

        Object.entries(data).forEach(([key, value]) => {
            if (key !== "answers" && key !== "typedAnswer" && key !== "subject") {
                formData.set(key, value);
            }
        });

        if (image) {
            formData.set("image", image);
        }

        if (type === Type.typedAnswer) {
            if (typedId) {
                formData.append(`answers[0].id`, typedId);
            }

            formData.append(`answers[0].content`, typedAnswer);
            formData.append(`answers[0].isTempAnswer`, true);
        } else {
            answers.forEach(({ id, name, content, isAnswer }, index) => {
                if (id) {
                    formData.append(`answers[${index}].id`, id);
                }
                formData.append(`answers[${index}].content`, content);
                formData.append(`answers[${index}].isTempAnswer`, isAnswer);
                formData.append(`answers[${index}].order`, name);
            });
        }

        dispatch(isEdit ? editQuestion(formData) : addQuestion(formData));
    };

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllQuestions({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllQuestions({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    const fetchDataByPageNumber = pageNumber => {
        dispatch(fetchAllQuestions({ ...filterObject, page: pageNumber }));
    };

    useEffect(() => {
        return () => {
            dispatch(clearQuestionState());
        };
    }, []);

    function cleanForm(successMessage, type = "add") {
        callToast("success", successMessage);
        dispatch(fetchAllQuestions(filterObject));

        $(`#${modalId}`).css("display", "none");
        if (type === "add") {
            $(`#${formId}`)[0].reset();
            setImage(null);
        }

        if (type === "edit") {
            setIsEdit(false);
            dispatch(setEditedQuestion(null));
        }
    }

    useEffect(() => {
        if (successMessage) {
            cleanForm(successMessage, "add");
        }
    }, [successMessage]);

    useEffect(() => {
        if (eqSuccessMessage) {
            cleanForm(eqSuccessMessage, "edit");
        }
    }, [eqSuccessMessage]);

    useEffect(() => {
        if (dqSuccessMessage) {
            cleanForm(dqSuccessMessage, "delete");
        }
    }, [dqSuccessMessage]);

    useEffect(() => {
        if (dqErrorMessage) {
            callToast("error", dqErrorMessage);
        }
    }, [dqErrorMessage]);

    useEffect(() => {
        if (errorObject && errorObject.id) {
            callToast("error", errorObject.id);
        }
    }, [errorObject]);

    useEffect(() => {
        if (amqSuccessMessage) {
            cleanForm(amqSuccessMessage, "normal");
            dispatch(setExcelAdd(false));
        }
    }, [amqSuccessMessage]);

    useEffect(() => {
        if (eodqSuccessMessage) {
            cleanForm(eodqSuccessMessage, "normal");
        }
    }, [eodqSuccessMessage]);

    const handleAddMultipleFromExcelFile = () => {
        dispatch(addMultipleQuestions({ questions: questionsExcel }));
    };

    function onCloseForm() {
        dispatch(setEditedQuestion(null));
        setValue("answers", []);
        clearErrors("answers");
        dispatch(setExcelAdd(false));
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={`DANH SÁCH ${modalLabel.toUpperCase()}`}
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel}`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    fetchDataByPageNumber={fetchDataByPageNumber}
                    columns={questionColumns}
                    rows={questions}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={QuestionTableBody}
                    modalId={modalId}
                    formId={formId}
                    modalLabel={modalLabel}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <QuestionModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                            setImage={setImage}
                            isEdit={isEdit}
                            control={control}
                            clearErrors={clearErrors}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    handleAddMultipleFromExcelFile={handleAddMultipleFromExcelFile}
                    onCloseForm={onCloseForm}
                    Filter={QuestionsFilter}
                    excelAdd={excelAdd}
                    recordsPerPage={10}
                />
            }
        />
    );
}

export default QuestionsPage;
