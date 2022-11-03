import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
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
} from "../../features/questionSlice";
import { fetchAllSubjects, subjectState } from "../../features/subjectSlice";
import { fetchAllChapters } from "../../features/chapterSlice";

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
        name: "A",
        sortField: "answerA",
        sortable: true,
    },
    {
        name: "B",
        sortField: "answerB",
        sortable: true,
    },
    {
        name: "C",
        sortField: "answerC",
        sortable: true,
    },
    {
        name: "D",
        sortField: "answerD",
        sortable: true,
    },
    {
        name: "Mức độ",
        sortField: "level",
        sortable: true,
    },
    {
        name: "Môn học",
        sortField: "teacher",
        sortable: true,
    },
    {
        name: "Giảng viên",
        sortField: "teacher",
        sortable: true,
    },
];

function QuestionsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(questionSchema),
    });

    const onSubmit = data => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.set(key, value);
        });

        if (image) {
            formData.set("image", image);
        }

        if (isEdit) {
            dispatch(editQuestion(formData));
        } else {
            dispatch(addQuestion(formData));
        }
    };

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

    const { subjects } = useSelector(subjectState);

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
            setImage(null);
        }
    }, [successMessage]);

    useEffect(() => {
        if (eqSuccessMessage) {
            callToast("success", eqSuccessMessage);
            dispatch(fetchAllQuestions(filterObject));
            $("#questionModal").css("display", "none");
            setIsEdit(false);
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

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            fetchAllQuestions({
                page: 1,
            })
        );
        dispatch(fetchAllChapters({ page: 0 }));
    }, []);

    const handleAddSelectedQuestionFromExcelFile = () => {
        dispatch(addMultipleQuestions(questionsExcel));
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
                    searchPlaceHolder={"Tìm kiếm theo tên và mã câu hỏi"}
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
