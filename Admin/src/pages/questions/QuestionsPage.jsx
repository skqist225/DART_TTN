import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Frame, QuestionModalBody, QuestionTableBody, Table } from "../../components";
import $ from "jquery";
import { questionSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { fetchAllChapters } from "../../features/chapterSlice";
import { fetchAllSubjects } from "../../features/subjectSlice";

const columns = [
    {
        name: "Mã câu hỏi",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Nội dung",
        sortField: "content",
        sortable: true,
    },
    {
        name: "Loại",
        sortField: "type",
        sortable: true,
    },
    {
        name: "Số lựa chọn",
        sortField: "answerC",
    },
    {
        name: "Độ khó",
        sortField: "level",
        sortable: true,
    },
    {
        name: "Chương",
        sortField: "chapter",
        sortable: true,
    },
    {
        name: "Môn học",
        sortField: "subject",
        sortable: true,
    },
    {
        name: "Giảng viên",
        sortField: "teacher",
        sortable: true,
    },
    {
        name: "Thao tác",
        sortable: false,
    },
];

function QuestionsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);
    const dispatch = useDispatch();

    const {
        questions,
        questionsExcel,
        errorObject,
        totalElements,
        totalPages,
        filterObject,
        addQuestion: { successMessage },
        editQuestion: { successMessage: eqSuccessMessage },
        deleteQuestion: { successMessage: dqSuccessMessage, errorMessage: dqErrorMessage },
        addMultipleQuestions: { successMessage: amqSuccessMessage },
        enableOrDisableQuestion: { successMessage: eodqSuccessMessage },
    } = useSelector(questionState);

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
        console.log(data);
        const formData = new FormData();

        if (data.type === "Đáp án điền") {
            if (!data.typedAnswer) {
                setError("typedAnswer", {
                    type: "custom",
                    message: "Đáp án điền không được để trống",
                });
                return;
            }
        } else {
            if (["Một đáp án", "Nhiều đáp án"].includes(data.type)) {
                if (data.answers.length === 0) {
                    callToast("error", "Vui lòng thêm lựa chọn");
                    return;
                } else {
                    if (data.answers.some(({ content }) => !content)) {
                        const emptyAnswers = [];
                        data.answers.forEach(({ content, name }) => {
                            if (!content) emptyAnswers.push(name);
                        });

                        callToast(
                            "error",
                            `Vui lòng điền nội dung lựa chọn ${emptyAnswers.join(",")}`
                        );
                        return;
                    } else if (data.answers.length === 1) {
                        callToast("error", `Vui lòng có ít nhất 2 lựa chọn cho 1 câu hỏi`);
                        return;
                    } else {
                        if (data.type === "Một đáp án") {
                            const atLeastOneAnswer = data.answers.some(({ isAnswer }) => isAnswer);
                            if (!atLeastOneAnswer) {
                                callToast("error", `Vui lòng chọn ít nhất 1 đáp án cho 1 câu hỏi`);
                                return;
                            }
                        }

                        if (data.type === "Nhiều đáp án") {
                            let i = 0;
                            data.answers.forEach(({ isAnswer }) => {
                                if (isAnswer) {
                                    i++;
                                }
                            });

                            if (i < 2) {
                                callToast(
                                    "error",
                                    `Vui lòng chọn ít nhất 2 đáp án cho câu hỏi có nhiều đáp án`
                                );
                                return;
                            }
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
        // let answer = null;
        // switch (data.type) {
        //     case "Nhiều đáp án":
        //     case "Một đáp án": {
        //         answer = data.answers
        //             .map(({ name, isAnswer }) => {
        //                 if (isAnswer) {
        //                     return isAnswer;
        //                 }
        //             })
        //             .join(",");
        //         break;
        //     }
        //     case "Đáp án điền": {
        //         answer = data.typedAnswer;
        //         break;
        //     }
        // }

        if (data.type === "Đáp án điền") {
            if (data.typedId) {
                formData.append(`answers[0].id`, data.typedId);
            }

            formData.append(`answers[0].content`, data.typedAnswer);
            formData.append(`answers[0].isAnswer`, true);
        } else {
            data.answers.forEach((answer, index) => {
                if (answer.id) {
                    formData.append(`answers[${index}].id`, answer.id);
                }
                formData.append(`answers[${index}].content`, `${answer.name}. ${answer.content}`);
                if (!answer.isAnswer) {
                    formData.append(`answers[${index}].isAnswer`, false);
                } else {
                    formData.append(`answers[${index}].isAnswer`, answer.isAnswer);
                }
            });
        }

        if (isEdit) {
            dispatch(editQuestion(formData));
        } else {
            dispatch(addQuestion(formData));
        }
    };

    useEffect(() => {
        dispatch(
            fetchAllQuestions({
                page: 1,
            })
        );
        dispatch(fetchAllChapters({ page: 0 }));
        dispatch(fetchAllSubjects({ page: 0 }));
    }, []);

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

    useEffect(() => {
        return () => {
            dispatch(clearQuestionState());
        };
    }, []);

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            $("#questionForm")[0].reset();
            dispatch(fetchAllQuestions(filterObject));
            $("#questionModal").css("display", "none");
            setImage(null);
        }
    }, [successMessage]);

    useEffect(() => {
        if (eqSuccessMessage) {
            callToast("success", eqSuccessMessage);
            dispatch(fetchAllQuestions(filterObject));
            $("#questionModal").css("display", "none");
            setIsEdit(false);
            dispatch(setEditedQuestion(null));
        }
    }, [eqSuccessMessage]);

    useEffect(() => {
        if (dqSuccessMessage) {
            callToast("success", dqSuccessMessage);
            dispatch(fetchAllQuestions(filterObject));
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

    const handleAddSelectedQuestionFromExcelFile = () => {
        console.log(questionsExcel);
        // dispatch(addMultipleQuestions({ questions: questionsExcel }));
    };

    useEffect(() => {
        if (amqSuccessMessage) {
            callToast("success", amqSuccessMessage);
            $("#questionModal").css("display", "none");
            dispatch(fetchAllQuestions(filterObject));
            dispatch(setExcelAdd(false));
        }
    }, [amqSuccessMessage]);

    useEffect(() => {
        if (eodqSuccessMessage) {
            callToast("success", eodqSuccessMessage);
            dispatch(fetchAllQuestions(filterObject));
        }
    }, [eodqSuccessMessage]);

    const fetchDataByPageNumber = pageNumber => {
        dispatch(fetchAllQuestions({ ...filterObject, page: pageNumber }));
    };

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH CÂU HỎI"}
            children={
                <Table
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    rows={questions}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={
                        <QuestionTableBody
                            rows={questions}
                            setIsEdit={setIsEdit}
                            dispatch={dispatch}
                        />
                    }
                    modalId='questionModal'
                    formId='questionForm'
                    modalLabel='câu hỏi'
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
                    handleAddSelectedQuestionFromExcelFile={handleAddSelectedQuestionFromExcelFile}
                    fetchDataByPageNumber={fetchDataByPageNumber}
                />
            }
        />
    );
}

export default QuestionsPage;
