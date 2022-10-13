import { callToast } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    clearUserState,
    disableUser,
    enableUser,
    fetchAllRoles,
    fetchAllUsers,
    userState,
} from "../../features/user/userSlice";

import $ from "jquery";
import "../../css/page/rooms.css";
import { Frame, Table, UserModalBody, UserTableBody } from "../../components";
import { userSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const columns = [
    {
        name: "Mã người dùng",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Họ tên",
        sortField: "fullName",
        sortable: true,
    },
    {
        name: "Trạng thái",
        sortField: "status",
        sortable: true,
    },
    {
        name: "Ngày sinh",
        sortField: "birthday",
        sortable: true,
    },
    {
        name: "Địa chỉ",
        sortField: "address",
        sortable: true,
    },
    {
        name: "Email",
        sortField: "email",
        sortable: true,
    },
    {
        name: "Giới tính",
        sortField: "sex",
        sortable: true,
    },
    {
        name: "Lớp",
        sortField: "class",
        sortable: true,
    },
    {
        name: "Vai trò",
        sortField: "role",
        sortable: true,
    },
];

const UsersPage = () => {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userSchema),
    });

    const {
        users,
        errorObject,
        totalElements,
        totalPages,
        filterObject,
        // deleteUser: { successMessage, errorMessage },
    } = useSelector(userState);

    const handleDisableUser = id => {
        dispatch(disableUser(id));
    };

    const handleEnableUser = id => {
        dispatch(enableUser(id));
    };

    const handlePageChange = (e, pn) => {
        dispatch(
            fetchAllUsers({
                page: pn + 1,
                query: localQuery,
                roles:
                    getSelectedRoles().length > 0
                        ? getSelectedRoles().join(",")
                        : "User,Host,Admin",
                statuses:
                    getSelectedStatuses().length > 0 ? getSelectedStatuses().join(",") : "1,0",
            })
        );
        setPage(pn);
    };

    useEffect(() => {
        return () => {
            dispatch(clearUserState());
        };
    }, []);

    // useEffect(() => {
    //     if (successMessage) {
    //         callToast("success", successMessage);
    //         dispatch(fetchAllUsers(page + 1));
    //     }
    // }, [successMessage]);

    // useEffect(() => {
    //     if (errorMessage) {
    //         callToast("error", errorMessage);
    //     }
    // }, [errorMessage]);

    function getSelectedRoles() {
        const roles = $("input.isRoleSelected");
        let isComplete = [];
        roles.each(function () {
            if ($(this).prop("checked")) {
                isComplete.push($(this).val());
            }
        });

        return isComplete;
    }

    function getSelectedStatuses() {
        const statuses = $("input.isStatusSelected");
        let isComplete = [];
        statuses.each(function () {
            if ($(this).prop("checked")) {
                isComplete.push($(this).val());
            }
        });

        return isComplete;
    }

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
        dispatch(
            fetchAllUsers({
                page: 1,
            })
        );

        dispatch(fetchAllRoles());
    }, []);

    const onSubmit = () => {};

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH NGƯỜI DÙNG"}
            children={
                <Table
                    searchPlaceHolder={"Tìm kiếm theo tên và mã người dùng"}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    rows={users}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={
                        <UserTableBody rows={users} setIsEdit={setIsEdit} dispatch={dispatch} />
                    }
                    modalId='userModal'
                    formId='userForm'
                    modalLabel='người dùng'
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <UserModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                            // subjects={subjects.map(({ id, name }) => ({ title: name, value: id }))}
                            setImage={setImage}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                />
            }
        />
    );
};

export default UsersPage;
