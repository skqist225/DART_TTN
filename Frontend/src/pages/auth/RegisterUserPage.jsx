import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl } from "@mui/material";
import { Tooltip } from "flowbite-react";
import { useForm } from "react-hook-form";
import { DatePicker, Input, Select } from "../../components";
import { sexOptions } from "../../components/users/UserModalBody";
import { fetchAllRoles, roleState } from "../../features/roleSlice";
import { registerPageSchema, userRegisterSchema } from "../../validation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { addUser, clearUserState, editUser, fetchUser, userState } from "../../features/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../../components/notify/Toast";
import { callToast } from "../../helpers";
import $ from "jquery";

function RegisterUserPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userId } = useParams();

    const {
        errorObject,
        addUser: { successMessage },
        editUser: { successMessage: eSuccessMessage },
        currentEditedUser,
    } = useSelector(userState);
    const { roles } = useSelector(roleState);

    useEffect(() => {
        dispatch(fetchUser({ id: userId }));
        dispatch(fetchAllRoles({ page: 0 }));
    }, []);

    useEffect(() => {
        return () => {
            dispatch(clearUserState());
        };
    }, []);

    useEffect(() => {
        if (currentEditedUser) {
            setValue("id", currentEditedUser.id);
            setValue("firstName", currentEditedUser.firstName);
            setValue("lastName", currentEditedUser.lastName);
            setValue("email", currentEditedUser.email);

            let birthday = currentEditedUser.birthday.split("-");
            birthday = `${birthday[2]}/${birthday[1]}/${birthday[0]}`;
            setValue("birthday", birthday);

            setValue("sex", currentEditedUser.sex);
            setValue("address", currentEditedUser.address);
        } else {
            setValue("id", "");
            setValue("firstName", "");
            setValue("lastName", "");
            setValue("email", "");
            setValue("password", "");
            setValue("birthday", "");
            setValue("sex", "");
            setValue("address", "");
            setValue("roles", []);
            $("#imagePreview").attr("src", "");
        }
    }, [currentEditedUser]);

    const {
        register,
        setValue,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(!currentEditedUser ? registerPageSchema : userRegisterSchema),
    });

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

        if (!currentEditedUser) {
            formData.set("roles", [data.roles]);
        } else {
            formData.set(
                "roles",
                currentEditedUser.roles.map(({ id }) => id)
            );
        }

        formData.set("needVerifyUser", true);

        if (currentEditedUser) {
            dispatch(editUser(formData));
        } else {
            dispatch(addUser(formData));
        }
    };

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
        if (successMessage) {
            callToast("success", successMessage);
            $(`#registerUserForm`)[0].reset();
        }
    }, [successMessage]);

    useEffect(() => {
        if (eSuccessMessage) {
            callToast("success", eSuccessMessage);

            dispatch(fetchUser({ id: userId }));
        }
    }, [eSuccessMessage]);

    return (
        <div
            className='max-w-7xl m-auto mt-10
        '
        >
            <div
                className='max-w-3xl m-auto
            '
            >
                <div className='font-bold justify-center w-full text-xl flex items-center mb-5'>
                    <div>
                        <Tooltip
                            content={
                                currentEditedUser ? "Trở về trang chủ" : "Trở về trang đăng nhập"
                            }
                            placement='left'
                        >
                            <Button
                                onClick={() => {
                                    if (currentEditedUser) {
                                        window.location.href = "/questions";
                                    } else {
                                        window.location.href = "/auth/login";
                                    }
                                }}
                            >
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    </div>
                    <div className='flex-1 w-full flex justify-center'>
                        {userId ? "Cập nhật thông tin người dùng" : "Đăng ký"}
                    </div>
                </div>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleSubmit(onSubmit)(e);
                    }}
                    id='registerUserForm'
                    autoComplete='nope'
                >
                    {" "}
                    <div className='col-flex items-center justify-center w-full'>
                        <div className='w-full mb-5'>
                            <div>
                                <Input
                                    label='Mã người dùng *'
                                    error={errors.id && errors.id.message}
                                    register={register}
                                    name='id'
                                    readOnly={currentEditedUser}
                                />
                            </div>
                        </div>
                        <div className='w-full flex items-start mb-5'>
                            <div className='flex-1 mr-5'>
                                <Input
                                    label='Họ *'
                                    error={errors.firstName && errors.firstName.message}
                                    register={register}
                                    name='firstName'
                                />
                            </div>
                            <div className='flex-1'>
                                <Input
                                    label='Tên *'
                                    error={errors.lastName && errors.lastName.message}
                                    register={register}
                                    name='lastName'
                                />
                            </div>
                        </div>
                        <div className='flex items-start w-full mb-5'>
                            <div className={`flex-1 mr-5`}>
                                <Input
                                    label='Địa chỉ email *'
                                    error={errors.email && errors.email.message}
                                    register={register}
                                    name='email'
                                    type='email'
                                />
                            </div>
                            <div className='flex-1'>
                                <Input
                                    label='Mật khẩu *'
                                    error={errors.password && errors.password.message}
                                    register={register}
                                    name='password'
                                    type='password'
                                />
                            </div>
                        </div>

                        <div className='flex items-start w-full mb-5'>
                            <div className='flex-1 mr-5'>
                                <DatePicker
                                    error={errors.birthday && errors.birthday.message}
                                    register={register}
                                    name='birthday'
                                    label='Ngày sinh *'
                                />
                            </div>
                            <div className='flex-1'>
                                <Select
                                    label='Giới tính *'
                                    error={errors.sex && errors.sex.message}
                                    register={register}
                                    name='sex'
                                    options={sexOptions}
                                    defaultValue={sexOptions && sexOptions[0] && sexOptions[0].id}
                                />
                            </div>
                        </div>
                        <div className='w-full mb-5 flex items-center'>
                            <div className={`w-full ${!currentEditedUser && "mr-5"}`}>
                                <Input
                                    label='Địa chỉ'
                                    register={register}
                                    name='address'
                                    type='address'
                                />
                            </div>
                            {!currentEditedUser && (
                                <div className='w-full'>
                                    <Select
                                        label='Vai trò *'
                                        error={errors.roles && errors.roles.message}
                                        register={register}
                                        name='roles'
                                        options={roles
                                            .filter(({ name }) => name !== "Quản trị viên")
                                            .map(role => ({
                                                title: role.name,
                                                value: role.id,
                                            }))}
                                        setValue={setValue}
                                        defaultValue={roles && roles.length && roles[0].id}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='w-full my-5'>
                        <FormControl fullWidth>
                            <Button variant='contained' type='submit'>
                                {currentEditedUser ? "Cập nhật thông tin" : "Đăng ký"}
                            </Button>
                        </FormControl>
                    </div>
                </form>
            </div>
            <Toast />
        </div>
    );
}

export default RegisterUserPage;
