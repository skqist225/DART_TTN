import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Frame, Table, UserModalBody, UserTableBody } from "../../components";
import UserFilter from "../../components/users/UserFilter";
import "../../css/page/rooms.css";
import { persistUserState } from "../../features/persistUserSlice";
import { fetchAllRoles } from "../../features/roleSlice";
import {
    addMultipleUsers,
    addUser,
    clearUserState,
    editUser,
    fetchAllUsers,
    setEditedUser,
    setUserExcelAdd,
    userState,
} from "../../features/userSlice";
import { callToast } from "../../helpers";
import { userRegisterSchema, userSchema } from "../../validation";
import { userColumns } from "../columns";

const UsersPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const formId = "userForm";
    const modalId = "userModal";
    const modalLabel = "người dùng";

    if (!userRoles.includes("Quản trị viên")) {
        navigate("/");
    }

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
        userExcelAdd,
        addUser: { successMessage },
        editUser: { successMessage: euSuccessMessage },
        deleteUser: { successMessage: dSuccessMessage, errorMessage: dErrorMessage },
        enableOrDisable: { successMessage: eodSuccessMessage, errorMessage: eodErrorMessage },
        addMultipleUsers: { successMessage: amSuccessMessage, errorMessage: amErrorMessage },
    } = useSelector(userState);

    useEffect(() => {
        if (errorObject) {
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
        if (eodSuccessMessage) {
            cleanForm(eodSuccessMessage, "normal");
        }
    }, [eodSuccessMessage]);

    useEffect(() => {
        if (amSuccessMessage) {
            cleanForm(amSuccessMessage, "add");
        }
    }, [amSuccessMessage]);

    useEffect(() => {
        if (amErrorMessage) {
            callToast("error", amErrorMessage);
        }
    }, [amErrorMessage]);

    useEffect(() => {
        if (eodErrorMessage) {
            callToast("error", eodErrorMessage);
        }
    }, [eodErrorMessage]);

    useEffect(() => {
        if (dSuccessMessage) {
            cleanForm(dSuccessMessage, "delete");
        }
    }, [dSuccessMessage]);

    useEffect(() => {
        if (dErrorMessage) {
            callToast("error", dErrorMessage);
        }
    }, [dErrorMessage]);

    const handleAddMultipleFromExcelFile = () => {
        if (excelFile) {
            dispatch(addMultipleUsers({ file: excelFile }));
        }
    };

    const onCloseForm = () => {
        dispatch(setEditedUser(null));
        dispatch(setUserExcelAdd(false));
    };

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={`DANH SÁCH ${modalLabel.toUpperCase()} (${totalElements})`}
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel} :: mã người dùng, họ & tên, email, địa chỉ`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={userColumns}
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
                            setExcelFile={setExcelFile}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    onCloseForm={onCloseForm}
                    fetchDataByPageNumber={fetchDataByPageNumber}
                    handleAddMultipleFromExcelFile={handleAddMultipleFromExcelFile}
                    excelAdd={userExcelAdd}
                    Filter={UserFilter}
                />
            }
        />
    );
};

export default UsersPage;
