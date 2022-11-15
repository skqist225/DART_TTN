import { callToast } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    addUser,
    clearUserState,
    disableUser,
    editUser,
    enableUser,
    fetchAllUsers,
    setEditedUser,
    setErrorField,
    userState,
} from "../../features/userSlice";

import $ from "jquery";
import "../../css/page/rooms.css";
import { Frame, Table, UserModalBody, UserTableBody } from "../../components";
import { userRegisterSchema, userSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchAllRoles } from "../../features/roleSlice";

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
        name: "Vai trò",
        sortField: "role",
        sortable: true,
    },
    {
        name: "Thao tác",
    },
];

const UsersPage = () => {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);

    const formId = "userForm";
    const modalId = "userModal";
    const modalLabel = "người dùng";

    useEffect(() => {
        dispatch(
            fetchAllUsers({
                page: 1,
            })
        );
        dispatch(fetchAllRoles({ page: 0 }));
    }, []);

    const {
        register,
        setValue,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userSchema),
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

    useEffect(() => {
        if (errorObject) {
            console.log(errorObject);
            Object.keys(errorObject).forEach(key => {
                setError(key, {
                    type: "custom",
                    message: errorObject[key],
                });
            });
        }
    }, [errorObject]);

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

    function cleanForm(successMessage, type = "normal") {
        callToast("success", successMessage);
        dispatch(fetchAllUsers(filterObject));

        $(`#${modalId}`).css("display", "none");
        if (type === "add") {
            $(`#${formId}`)[0].reset();
            setImage(null);
        }

        if (type === "edit") {
            setIsEdit(false);
            dispatch(setEditedUser(null));
        }
    }

    useEffect(() => {
        if (successMessage) {
            cleanForm(successMessage, "add");
        }
    }, [successMessage]);

    useEffect(() => {
        if (euSuccessMessage) {
            cleanForm(euSuccessMessage, "add");
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

    const onSubmit = data => {
        if (data.roles.length === 0) {
            setError("roles", { type: "custom", message: "Vai trò không được để trống" });
            return;
        }
        console.log(data);

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

    const onCloseForm = () => {
        dispatch(setEditedUser(null));
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
                    TableBody={UserTableBody}
                    modalId={modalId}
                    formId={formId}
                    modalLabel={modalLabel}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <UserModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                            roles={roles.map(({ id, name }) => ({
                                title: lookupRole(name),
                                value: id,
                            }))}
                            setImage={setImage}
                            isEdit={isEdit}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    onCloseForm={onCloseForm}
                />
            }
        />
    );
};

export default UsersPage;
