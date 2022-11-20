import { callToast } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    addUser,
    clearUserState,
    editUser,
    fetchAllUsers,
    setEditedUser,
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
        enableOrDisableUser: { successMessage: eodqSuccessMessage },
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
            fetchAllUsers({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        console.log(sortField, sortDir);
        dispatch(
            fetchAllUsers({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    const fetchDataByPageNumber = pageNumber => {
        dispatch(fetchAllUsers({ ...filterObject, page: pageNumber }));
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
                    setError("roles", {
                        type: "custom",
                        message: "Mật khẩu ít nhất 8 ký tự",
                    });
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

    useEffect(() => {
        if (eodqSuccessMessage) {
            cleanForm(eodqSuccessMessage, "normal");
        }
    }, [eodqSuccessMessage]);

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
                    fetchDataByPageNumber={fetchDataByPageNumber}
                />
            }
        />
    );
};

export default UsersPage;
