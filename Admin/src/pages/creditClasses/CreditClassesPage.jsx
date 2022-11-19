import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    CreditClassFilter,
    CreditClassModalBody,
    CreditClassTableBody,
    Frame,
    Table,
} from "../../components";
import $ from "jquery";
import { creditClassSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchAllSubjects } from "../../features/subjectSlice";
import {
    addCreditClass,
    clearCreditClassState,
    creditClassState,
    editCreditClass,
    fetchAllCreditClasses,
    setEditedCreditClass,
} from "../../features/creditClassSlice";
import { fetchAllUsers } from "../../features/userSlice";

const columns = [
    {
        name: "Mã LTC",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Năm học",
        sortField: "content",
        sortable: true,
    },
    {
        name: "Học kỳ",
        sortField: "type",
        sortable: true,
    },
    {
        name: "Môn học",
        sortField: "answerC",
    },
    {
        name: "Nhóm",
        sortField: "level",
        sortable: true,
    },
    {
        name: "Tình trạng",
        sortField: "chapter",
        sortable: true,
    },
    {
        name: "Giảng viên",
        sortField: "subject",
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
            fetchAllCreditClasses({
                page: 1,
            })
        );
        dispatch(fetchAllSubjects({ page: 0 }));
        dispatch(fetchAllUsers({ page: 0, role: "Giảng viên" }));
    }, []);

    const {
        creditClasses,
        errorObject,
        totalElements,
        totalPages,
        filterObject,
        addCreditClass: { successMessage },
        editCreditClass: { successMessage: eqSuccessMessage },
        deleteCreditClass: { successMessage: dqSuccessMessage, errorMessage: dqErrorMessage },
        enableOrDisableCreditClass: { successMessage: eodqSuccessMessage },
    } = useSelector(creditClassState);

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
        dispatch(isEdit ? editCreditClass(data) : addCreditClass(data));
    };

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllCreditClasses({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllCreditClasses({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearCreditClassState());
        };
    }, []);

    function cleanForm(successMessage, type = "add") {
        callToast("success", successMessage);
        dispatch(fetchAllCreditClasses(filterObject));

        $(`#${modalId}`).css("display", "none");
        if (type === "add") {
            $(`#${formId}`)[0].reset();
        }

        if (type === "edit") {
            setIsEdit(false);
            dispatch(setEditedCreditClass(null));
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
        if (eodqSuccessMessage) {
            cleanForm(eodqSuccessMessage, "enable");
        }
    }, [eodqSuccessMessage]);

    useEffect(() => {
        if (errorObject && errorObject.id) {
            callToast("error", errorObject.id);
        }
    }, [errorObject]);

    const fetchDataByPageNumber = pageNumber => {
        dispatch(fetchAllCreditClasses({ ...filterObject, page: pageNumber }));
    };

    function onCloseForm() {
        dispatch(setEditedCreditClass(null));
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH LỚP TÍN CHỈ"}
            children={
                <Table
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    rows={creditClasses}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={CreditClassTableBody}
                    modalId={modalId}
                    formId={formId}
                    modalLabel={modalLabel}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <CreditClassModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                            isEdit={isEdit}
                            control={control}
                            clearErrors={clearErrors}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    fetchDataByPageNumber={fetchDataByPageNumber}
                    onCloseForm={onCloseForm}
                    Filter={CreditClassFilter}
                />
            }
        />
    );
}

export default CreditClassesPage;
