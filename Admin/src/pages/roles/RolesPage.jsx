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
import $ from "jquery";
import { roleSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { roleState } from "../../features/roleSlice";

const columns = [
    {
        name: "Mã vai trò",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Tên vai trò",
        sortField: "name",
        sortable: true,
    },
];

function RolesPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

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

    const {
        roles,
        totalElements,
        totalPages,
        filterObject,
        addRole: { successMessage },
        editRole: { successMessage: esSuccessMessage },
        deleteRole: { successMessage: dsSuccessMessage },
    } = useSelector(roleState);

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

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            fetchAllRoles({
                page: 1,
            })
        );
    }, []);

    function onCloseForm() {
        dispatch(setEditedRole(null));
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH VAI TRÒ"}
            children={
                <Table
                    searchPlaceHolder={"Tìm kiếm theo tên và mã vai trò"}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    rows={roles}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={RoleTableBody}
                    modalId='roleModal'
                    formId='roleForm'
                    modalLabel='vai trò'
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <>
                            <RoleModalBody
                                errors={errors}
                                register={register}
                                dispatch={dispatch}
                                setValue={setValue}
                            />
                        </>
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    onCloseForm={onCloseForm}
                />
            }
        />
    );
}

export default RolesPage;
