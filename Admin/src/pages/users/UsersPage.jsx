import { callToast } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    addUser,
    clearUserState,
    disableUser,
    editUser,
    enableUser,
    fetchAllRoles,
    fetchAllUsers,
    setErrorField,
    userState,
} from "../../features/userSlice";

import $ from "jquery";
import "../../css/page/rooms.css";
import { Frame, Table, UserModalBody, UserTableBody } from "../../components";
import { userRegisterSchema, userSchema } from "../../validation";
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
        resolver: yupResolver(isEdit ? userRegisterSchema : userSchema),
    });

    const {
        users,
        roles,
        filterObject,
        errorObject,
        totalElements,
        totalPages,
        addUser: { successMessage },
        editUser: { successMessage: euSuccessMessage },
        deleteUser: { successMessage: duSuccessMessage },
    } = useSelector(userState);

    const { classes } = useSelector(classState);

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

    function closeForm(successMessage) {
        callToast("success", successMessage);
        $("#userForm")[0].reset();
        $("#userModal").css("display", "none");
        dispatch(fetchAllUsers(filterObject));
    }

    useEffect(() => {
        if (successMessage) {
            closeForm(successMessage);
        }
    }, [successMessage]);

    useEffect(() => {
        if (euSuccessMessage) {
            closeForm(euSuccessMessage);
            setIsEdit(false);
        }
    }, [euSuccessMessage]);

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
        dispatch(fetchAllClasses({ page: 0 }));
    }, []);

    const onSubmit = data => {
        let { birthday } = data;
        birthday = birthday.split("/");
        birthday = birthday[2] + "-" + birthday[1] + "-" + birthday[0];

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.set(key, value);
        });
        formData.delete("birthday");
        formData.set("birthday", birthday);

        if (image) {
            formData.set("image", image);
        }

        if (isEdit) {
            if (data.password) {
                if (data.password.length < 8) {
                    dispatch(
                        setErrorField({
                            key: "password",
                            value: "Mật khẩu ít nhất 8 ký tự",
                        })
                    );
                    return;
                }
            }

            dispatch(editUser(formData));
        } else {
            dispatch(addUser(formData));
        }
    };

    const lookupRole = role => {
        switch (role) {
            case "Admin": {
                return "Quản trị viên";
            }
            case "Student": {
                return "Sinh viên";
            }
            case "Teacher": {
                return "Giảng viên";
            }
        }
    };

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
                            classes={classes.map(({ id, name }) => ({
                                title: name,
                                value: id,
                            }))}
                            roles={roles.map(({ id, name }) => {
                                let role = lookupRole(name);

                                return { title: role, value: id };
                            })}
                            setImage={setImage}
                            isEdit={isEdit}
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
