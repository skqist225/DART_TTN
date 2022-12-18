import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Frame,
    RegisterFilter,
    RegisterModalBody,
    RegisterTableBody,
    Table,
} from "../../components";
import { fetchAllCreditClasses } from "../../features/creditClassSlice";
import { persistUserState } from "../../features/persistUserSlice";
import {
    addMultipleRegisters,
    addRegister,
    clearRegisterState,
    fetchAllRegisters,
    registerState,
    setEditedRegister,
} from "../../features/registerSlice";
import { callToast } from "../../helpers";
import { registerColumns } from "../columns";

function RegistersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [excelFile, setExcelFile] = useState(null);

    const {
        registers,
        errorObject,
        totalElements,
        totalPages,
        filterObject,
        loading,
        registerExcelAdd,
        addRegister: { successMessage },
        editRegister: { successMessage: eqSuccessMessage },
        deleteRegister: { successMessage: dqSuccessMessage, errorMessage: dqErrorMessage },
        addMultipleRegisters: {
            successMessage: amuSuccessMessage,
            errorMessage: amuErrorMessage,
            loading: amuLoading,
        },
        enableOrDisableRegister: { successMessage: eodSuccessMessage },
    } = useSelector(registerState);
    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const formId = "registerForm";
    const modalId = "registerModal";
    const modalLabel = "đăng ký";

    if (userRoles.includes("Sinh viên") || userRoles.includes("Giảng viên")) {
        navigate("/");
    }

    useEffect(() => {
        dispatch(
            fetchAllRegisters({
                page: 1,
            })
        );
        dispatch(fetchAllCreditClasses({ page: 0, active: true, haveRegister: false }));
    }, []);

    const {
        register,
        setValue,
        handleSubmit,
        control,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({});

    const onSubmit = data => {
        const { creditClassId, registerList } = data;
        if (registerList.length === 0) {
            callToast("error", "Danh sách đăng ký không được trống");
            return;
        }

        if (isEdit) {
        } else {
            dispatch(
                addRegister({
                    creditClassId,
                    registerList,
                })
            );
        }
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

    useEffect(() => {
        if (amuSuccessMessage) {
            cleanForm(amuSuccessMessage, "add");
        }
    }, [amuSuccessMessage]);

    useEffect(() => {
        if (amuErrorMessage) {
            callToast("error", amuErrorMessage);
        }
    }, [amuErrorMessage]);

    useEffect(() => {
        if (eodSuccessMessage) {
            cleanForm(eodSuccessMessage, "enable");
        }
    }, [eodSuccessMessage]);

    const handleAddMultipleFromExcelFile = () => {
        if (excelFile) {
            dispatch(addMultipleRegisters({ file: excelFile }));
        }
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
            title={`DANH SÁCH ${modalLabel.toUpperCase()}`}
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel} :: mã sinh viên, tên sinh viên`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={registerColumns}
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
                            setExcelFile={setExcelFile}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    fetchDataByPageNumber={fetchDataByPageNumber}
                    onCloseForm={onCloseForm}
                    handleAddMultipleFromExcelFile={handleAddMultipleFromExcelFile}
                    Filter={RegisterFilter}
                    recordsPerPage={15}
                    // loading={loading}
                    excelAdd={registerExcelAdd}
                />
            }
        />
    );
}

export default RegistersPage;
