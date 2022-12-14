import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Frame, RoleModalBody, RoleTableBody, Table } from "../../components";
import {
    addRole,
    clearRoleState,
    editRole,
    fetchAllRoles,
    setEditedRole,
} from "../../features/roleSlice";
import { roleSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { roleState } from "../../features/roleSlice";
import { roleColumns } from "../columns";
import $ from "jquery";

function RolesPage() {
    const dispatch = useDispatch();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const {
        roles,
        totalElements,
        totalPages,
        filterObject,
        loading,
        addRole: { successMessage },
        editRole: { successMessage: esSuccessMessage },
        deleteRole: { successMessage: dsSuccessMessage, errorMessage: drErrorMessage },
    } = useSelector(roleState);

    const formId = "roleForm";
    const modalId = "roleModal";
    const modalLabel = "vai trò";

    useEffect(() => {
        dispatch(
            fetchAllRoles({
                page: 1,
            })
        );
    }, []);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(roleSchema),
    });

    const onSubmit = data => {
        if (isEdit) {
            dispatch(editRole(data));
        } else {
            dispatch(addRole(data));
        }
    };

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllRoles({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllRoles({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearRoleState());
        };
    }, []);

    function closeForm(successMessage) {
        callToast("success", successMessage);
        $("#roleForm")[0].reset();
        $("#roleModal").css("display", "none");
        dispatch(fetchAllRoles(filterObject));
    }

    useEffect(() => {
        if (!isEdit) {
            setValue("id", "");
            setValue("name", "");
        }
    }, [isEdit]);

    useEffect(() => {
        if (successMessage) {
            closeForm(successMessage);
        }
    }, [successMessage]);

    useEffect(() => {
        if (esSuccessMessage) {
            closeForm(successMessage);
            setIsEdit(false);
            dispatch(setEditedRole(null));
        }
    }, [esSuccessMessage]);

    useEffect(() => {
        if (dsSuccessMessage) {
            callToast("success", dsSuccessMessage);
            dispatch(fetchAllRoles(filterObject));
        }
    }, [dsSuccessMessage]);

    useEffect(() => {
        if (drErrorMessage) {
            callToast("error", drErrorMessage);
        }
    }, [drErrorMessage]);

    function onCloseForm() {
        dispatch(setEditedRole(null));
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={`DANH SÁCH ${modalLabel.toUpperCase()} (${totalElements})`}
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel} :: mã vai trò, tên vai trò`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={roleColumns}
                    rows={roles}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={RoleTableBody}
                    modalId={modalId}
                    formId={formId}
                    modalLabel={modalLabel}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <RoleModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    onCloseForm={onCloseForm}
                    loading={loading}
                />
            }
        />
    );
}

export default RolesPage;
