import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Frame,
    QuestionModalBody,
    CreditClassFilter,
    QuestionTableBody,
    Table,
} from "../../components";
import $ from "jquery";
import { creditClassSchema, questionSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    addQuestion,
    editQuestion,
    questionState,
    clearQuestionState,
    fetchAllCreditClass,
    addMultipleCreditClass,
    setExcelAdd,
    setEditedQuestion,
} from "../../features/questionSlice";
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

function CreditClassesPage() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const formId = "creditClassForm";
    const modalId = "creditClassModal";
    const modalLabel = "lớp tín chỉ";

    useEffect(() => {
        dispatch(
            fetchAllCreditClass({
                page: 1,
            })
        );
        dispatch(fetchAllSubjects({ page: 0 }));
    }, []);

    const {
        creditClasses,
        creditClassesExcel,
        errorObject,
        totalElements,
        totalPages,
        filterObject,
        addQuestion: { successMessage },
        editQuestion: { successMessage: eqSuccessMessage },
        deleteQuestion: { successMessage: dqSuccessMessage, errorMessage: dqErrorMessage },
        addMultipleCreditClass: { successMessage: amqSuccessMessage },
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
        resolver: yupResolver(creditClassSchema),
    });

    const onSubmit = data => {
        dispatch(isEdit ? editQuestion(formData) : addQuestion(formData));
    };

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllCreditClass({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllCreditClass({
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

    function cleanForm(successMessage, type = "add") {
        callToast("success", successMessage);
        dispatch(fetchAllCreditClass(filterObject));

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

    const fetchDataByPageNumber = pageNumber => {
        dispatch(fetchAllCreditClass({ ...filterObject, page: pageNumber }));
    };

    const handleAddSelectedQuestionFromExcelFile = () => {
        dispatch(addMultipleCreditClass({ creditClasses: creditClassesExcel }));
    };

    function onCloseForm() {
        dispatch(setEditedQuestion(null));
        setValue("answers", []);
        clearErrors("answers");
    }

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
                    rows={creditClasses}
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
                    handleAddSelectedQuestionFromExcelFile={handleAddSelectedQuestionFromExcelFile}
                    fetchDataByPageNumber={fetchDataByPageNumber}
                    onCloseForm={onCloseForm}
                    // Filter={CreditClassFilter}
                />
            }
        />
    );
}

export default CreditClassesPage;
