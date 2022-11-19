import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Frame,
    RegisterFilter,
    RegisterModalBody,
    RegisterTableBody,
    Table,
} from "../../components";
import $ from "jquery";
import { questionSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    addRegister,
    editRegister,
    clearRegisterState,
    fetchAllRegisters,
    setEditedRegister,
    registerState,
} from "../../features/registerSlice";

const columns = [
    {
        name: "Mã SV",
        sortField: "fullName",
        sortable: true,
    },
    {
        name: "Họ tên",
        sortField: "creditClass",
        sortable: true,
    },
    {
        name: "Mã LTC",
        sortField: "creditClass",
        sortable: true,
    },
    {
        name: "Niên khóa",
        sortField: "creditClass",
        sortable: true,
    },
    {
        name: "Học kỳ",
        sortField: "creditClass",
        sortable: true,
    },
    {
        name: "Môn học",
        sortField: "status",
        sortable: true,
    },
    {
        name: "Giảng viên",
        sortField: "status",
        sortable: true,
    },
];

function RegistersPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const dispatch = useDispatch();

    const formId = "registerForm";
    const modalId = "registerModal";
    const modalLabel = "đăng ký";

    useEffect(() => {
        dispatch(
            fetchAllRegisters({
                page: 1,
            })
        );
    }, []);

    const {
        registers,
        errorObject,
        totalElements,
        totalPages,
        filterObject,
        addRegister: { successMessage },
        editRegister: { successMessage: eqSuccessMessage },
        deleteRegister: { successMessage: dqSuccessMessage, errorMessage: dqErrorMessage },
    } = useSelector(registerState);

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
        dispatch(isEdit ? editRegister(formData) : addRegister(formData));
    };

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllRegisters({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllRegisters({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearRegisterState());
        };
    }, []);

    function cleanForm(successMessage, type = "add") {
        callToast("success", successMessage);
        dispatch(fetchAllRegisters(filterObject));

        $(`#${modalId}`).css("display", "none");
        if (type === "add") {
            $(`#${formId}`)[0].reset();
        }

        if (type === "edit") {
            setIsEdit(false);
            dispatch(setEditedRegister(null));
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

    const fetchDataByPageNumber = pageNumber => {
        dispatch(fetchAllRegisters({ ...filterObject, page: pageNumber }));
    };

    function onCloseForm() {
        dispatch(setEditedRegister(null));
        setValue("answers", []);
        clearErrors("answers");
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH ĐĂNG KÝ"}
            children={
                <Table
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    rows={registers}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={RegisterTableBody}
                    modalId={modalId}
                    formId={formId}
                    modalLabel={modalLabel}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <RegisterModalBody
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
                    Filter={RegisterFilter}
                />
            }
        />
    );
}

export default RegistersPage;
