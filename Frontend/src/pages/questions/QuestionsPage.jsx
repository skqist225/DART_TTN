import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Frame,
    QuestionModalBody,
    QuestionsFilter,
    QuestionTableBody,
    Table,
} from "../../components";
import { persistUserState } from "../../features/persistUserSlice";
import {
    addMultipleQuestions,
    addQuestion,
    clearQuestionState,
    editQuestion,
    fetchAllQuestions,
    questionState,
    setEditedQuestion,
    setExcelAdd,
} from "../../features/questionSlice";
import {
    fetchAllSubjects,
    fetchAllSubjectsFiltered,
    subjectState,
} from "../../features/subjectSlice";
import { fetchAllUsers } from "../../features/userSlice";
import { callToast } from "../../helpers";
import { questionSchema } from "../../validation";
import { questionColumns } from "../columns";

const Type = {
    oneAnswer: "Một đáp án",
    multipleAnswer: "Nhiều đáp án",
    typedAnswer: "Đáp án điền",
};

function QuestionsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);
    const [excelFile, setExcelFile] = useState(null);

    const {
        questions,
        errorObject,
        totalElements,
        totalPages,
        filterObject,
        excelAdd,
        addQuestion: { successMessage },
        editQuestion: { successMessage: eqSuccessMessage },
        deleteQuestion: { successMessage: dqSuccessMessage, errorMessage: dqErrorMessage },
        addMultipleQuestions: { successMessage: amqSuccessMessage, errorMessage: amqErrorMessage },
        enableOrDisableQuestion: { successMessage: eodqSuccessMessage },
    } = useSelector(questionState);
    const { subjects } = useSelector(subjectState);

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const formId = "questionForm";
    const modalId = "questionModal";
    const modalLabel = "câu hỏi";

    if (userRoles.includes("Sinh viên")) {
        navigate("/");
    }

    useEffect(() => {
        dispatch(
            fetchAllQuestions({
                page: 1,
            })
        );

        //subjects for adding
        if (userRoles.includes("Quản trị viên")) {
            //subjects have chapter
            dispatch(fetchAllSubjects({ page: 0, haveChapter: true }));
        } else {
            //subjects teacher teaches
            dispatch(fetchAllSubjects({ page: 0, teacher: user.id }));
        }

        //subjects for filtering
        dispatch(fetchAllSubjectsFiltered({ haveChapter: true, haveQuestion: true }));

        if (userRoles.includes("Quản trị viên")) {
            dispatch(fetchAllUsers({ page: 0, role: "!SV" }));
        }
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
                        let numberOfAnswers = 0;
                        answers.forEach(({ isAnswer }) => {
                            if (isAnswer) {
                                numberOfAnswers++;
                            }
                        });
                        if (numberOfAnswers >= 2) {
                            callToast("error", "Câu hỏi 1 đáp án không thể có 2 đáp án");
                            return;
                        }
                    } else if (type === Type.multipleAnswer) {
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
        onCloseForm();

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
        if (amqErrorMessage) {
            callToast("error", amqErrorMessage);
        }
    }, [amqErrorMessage]);

    useEffect(() => {
        if (eodqSuccessMessage) {
            cleanForm(eodqSuccessMessage, "normal");
        }
    }, [eodqSuccessMessage]);

    const handleAddMultipleFromExcelFile = () => {
        if (excelFile) {
            dispatch(addMultipleQuestions({ file: excelFile }));
        }
    };

    function onCloseForm() {
        dispatch(setEditedQuestion(null));
        setValue("answers", []);
        clearErrors("answers");
        dispatch(setExcelAdd(false));
        setValue("subject", subjects[0].id);
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={`DANH SÁCH ${modalLabel.toUpperCase()} (${totalElements})`}
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel} :: mã câu hỏi, nội dung câu hỏi, tên chương`}
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
                            dy
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                            setImage={setImage}
                            isEdit={isEdit}
                            control={control}
                            clearErrors={clearErrors}
                            setExcelFile={setExcelFile}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    handleAddMultipleFromExcelFile={handleAddMultipleFromExcelFile}
                    onCloseForm={onCloseForm}
                    Filter={QuestionsFilter}
                    excelAdd={excelAdd}
                    recordsPerPage={10}
                    setValue={setValue}
                />
            }
        />
    );
}

export default QuestionsPage;
