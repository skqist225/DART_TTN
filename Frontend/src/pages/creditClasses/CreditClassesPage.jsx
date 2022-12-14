import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
    CreditClassFilter,
    CreditClassModalBody,
    CreditClassTableBody,
    Frame,
    Table,
} from "../../components";
import {
    addCreditClass,
    clearCreditClassState,
    creditClassState,
    editCreditClass,
    fetchAllCreditClasses,
    setEditedCreditClass,
} from "../../features/creditClassSlice";
import { clearExamState, examState } from "../../features/examSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { fetchAllSubjects } from "../../features/subjectSlice";
import { fetchAllUsers } from "../../features/userSlice";
import { callToast } from "../../helpers";
import { creditClassSchema } from "../../validation";
import { creditClassColumns } from "../columns";

function CreditClassesPage() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const formId = "creditClassForm";
    const modalId = "creditClassModal";
    const modalLabel = "lớp tín chỉ";

    useEffect(() => {
        if (userRoles.includes("Quản trị viên")) {
            dispatch(
                fetchAllCreditClasses({
                    page: 1,
                })
            );
        } else {
            dispatch(
                fetchAllCreditClasses({
                    page: 1,
                    teacher: user.id,
                })
            );
        }

        dispatch(fetchAllSubjects({ page: 0 }));
        dispatch(fetchAllUsers({ page: 0, role: "!SV" }));
    }, []);

    const {
        creditClasses,
        errorObject,
        totalElements,
        totalPages,
        filterObject,
        loading,
        addCreditClass: { successMessage },
        editCreditClass: { successMessage: eqSuccessMessage },
        deleteCreditClass: { successMessage: dqSuccessMessage, errorMessage: dqErrorMessage },
        enableOrDisableCreditClass: { successMessage: eodqSuccessMessage },
    } = useSelector(creditClassState);

    const {
        addExam: { successMessage: aeSuccessMessage },
    } = useSelector(examState);

    useEffect(() => {
        if (aeSuccessMessage) {
            callToast("success", aeSuccessMessage);
            $("#examModal").css("display", "none");
        }
    }, [aeSuccessMessage]);

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
        if (user.roles.map(({ name }) => name).includes("Quản trị viên")) {
            dispatch(
                fetchAllCreditClasses({
                    ...filterObject,
                    query,
                })
            );
        } else {
            dispatch(
                fetchAllCreditClasses({
                    ...filterObject,
                    query,
                    teacher: user.id,
                })
            );
        }
    };

    const handleSortChange = (sortField, sortDir) => {
        if (user.roles.map(({ name }) => name).includes("Quản trị viên")) {
            dispatch(
                fetchAllCreditClasses({
                    ...filterObject,
                    sortField,
                    sortDir,
                })
            );
        } else {
            dispatch(
                fetchAllCreditClasses({
                    ...filterObject,
                    sortField,
                    sortDir,
                    teacher: user.id,
                })
            );
        }
    };

    useEffect(() => {
        return () => {
            dispatch(clearCreditClassState());
            dispatch(clearExamState());
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
            title={`DANH SÁCH ${modalLabel.toUpperCase()} (${totalElements})`}
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel} ::`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={creditClassColumns}
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
                    // loading={loading}
                />
            }
        />
    );
}

export default CreditClassesPage;
