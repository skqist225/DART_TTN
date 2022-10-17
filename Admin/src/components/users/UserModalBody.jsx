import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { tailwindCss } from "../../tailwind";
import Select from "../utils/userInputs/Select";

import { CloseIcon } from "../../images";
import Input from "../utils/userInputs/Input";
import { setEditedUser, userState } from "../../features/user/userSlice";
import $ from "jquery";
import DatePicker from "../utils/datePicker/DatePicker";

const sexOptions = [
    {
        title: "Nam",
        value: "MALE",
    },
    {
        title: "Nữ",
        value: "FEMALE",
    },
];

function QuestionModalBody({
    errors,
    register,
    dispatch,
    setValue,
    classes,
    roles,
    setImage,
    isEdit,
}) {
    const { editedUser, errorObject } = useSelector(userState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (editedUser) {
            dispatch(setEditedUser(null));
        }
    };

    if (editedUser) {
        setValue("id", editedUser.id);
        setValue("firstName", editedUser.firstName);
        setValue("lastName", editedUser.lastName);
        setValue("email", editedUser.email);

        let birthday = editedUser.birthday.split("-");
        birthday = birthday[2] + "/" + birthday[1] + "/" + birthday[0];
        setValue("birthday", birthday);
        setValue("sex", editedUser.sex);
        setValue("address", editedUser.address);
        setValue("roleId", editedUser.role.id);
        setValue("classId", editedUser.cls.id);
    }

    const previewImage = event => {
        const image = event.target.files[0];
        const fileReader = new FileReader();

        $("#imagePreviewName").text(` : ${image.name}`);
        $("#removePreviewImage").css("display", "block");

        fileReader.onload = function (e) {
            $("#imagePreview").attr("src", e.target.result);
        };

        fileReader.readAsDataURL(image);
        setImage(image);
    };

    const removePreviewImage = () => {
        $("#imagePreview").attr("src", "");
        $("#imagePreviewName").text(``);
        $("#removePreviewImage").css("display", "none");
        setImage(null);
    };

    return (
        <div>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full mb-5'>
                    <div>
                        <Input
                            label='Mã người dùng *'
                            error={
                                (errors.id && errors.id.message) || (errorObject && errorObject.id)
                            }
                            register={register}
                            name='id'
                            onKeyDown={onKeyDown}
                            readOnly={isEdit}
                        />
                    </div>
                </div>
                <div className='w-full flex items-start mb-5'>
                    <div className='flex-1 mr-5'>
                        <Input
                            label='Họ *'
                            error={
                                (errors.firstName && errors.firstName.message) ||
                                (errorObject && errorObject.firstName)
                            }
                            register={register}
                            name='firstName'
                            onKeyDown={onKeyDown}
                        />
                    </div>
                    <div className='flex-1'>
                        <Input
                            label='Tên *'
                            error={
                                (errors.lastName && errors.lastName.message) ||
                                (errorObject && errorObject.lastName)
                            }
                            register={register}
                            name='lastName'
                            onKeyDown={onKeyDown}
                        />
                    </div>
                </div>
                <div className='flex items-start w-full mb-5'>
                    <div className='flex-1 mr-5'>
                        <Input
                            label='Địa chỉ email *'
                            error={
                                (errors.email && errors.email.message) ||
                                (errorObject && errorObject.email)
                            }
                            register={register}
                            name='email'
                            type='email'
                            onKeyDown={onKeyDown}
                        />
                    </div>
                    <div className='flex-1'>
                        <Input
                            label='Mật khẩu *'
                            error={
                                (errors.password && errors.password.message) ||
                                (errorObject && errorObject.password)
                            }
                            register={register}
                            name='password'
                            type='password'
                            onKeyDown={onKeyDown}
                        />
                    </div>
                </div>

                <div className='flex items-start w-full mb-5'>
                    <div className='flex-1 mr-5'>
                        <DatePicker
                            error={
                                (errors.birthday && errors.birthday.message) ||
                                (errorObject && errorObject.birthday)
                            }
                            register={register}
                            name='birthday'
                            onKeyDown={onKeyDown}
                        />
                    </div>
                    <div className='flex-1'>
                        <Select
                            label='Giới tính *'
                            labelClassName={tailwindCss.label}
                            selectClassName={tailwindCss.select}
                            error={errors.sex && errors.sex.message}
                            register={register}
                            name='sex'
                            options={sexOptions}
                        />
                    </div>
                </div>
                <div className='w-full mb-5'>
                    <Input
                        label='Địa chỉ'
                        error={
                            (errors.address && errors.address.message) ||
                            (errorObject && errorObject.address)
                        }
                        register={register}
                        name='address'
                        type='address'
                        onKeyDown={onKeyDown}
                    />
                </div>
                <div className='flex items-start w-full mb-5'>
                    <div className='flex-1 mr-5'>
                        <Select
                            label='Vai trò *'
                            labelClassName={tailwindCss.label}
                            selectClassName={tailwindCss.select}
                            error={errors.roleId && errors.roleId.message}
                            register={register}
                            name='roleId'
                            options={roles}
                            setValue={setValue}
                        />
                    </div>
                    <div className='flex-1'>
                        <Select
                            label='Lớp *'
                            labelClassName={tailwindCss.label}
                            selectClassName={tailwindCss.select}
                            error={errors.classId && errors.classId.message}
                            register={register}
                            name='classId'
                            options={classes}
                            setValue={setValue}
                        />
                    </div>
                </div>
            </div>

            <div className='mt-3'>
                <label htmlFor='countries' className={tailwindCss.label}>
                    Ảnh đại diện <span id='imagePreviewName'></span>
                </label>
            </div>

            <div className='flex'>
                <div className='flex flex-initial justify-center items-center w-3/6 mr-5'>
                    <label htmlFor='dropzone-file' className={tailwindCss.dropZoneLabel}>
                        <div className='flex flex-col justify-center items-center pt-5 pb-6'>
                            <svg
                                aria-hidden='true'
                                className='mb-3 w-10 h-10 text-gray-400'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                                ></path>
                            </svg>
                            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                                <span className='font-semibold'>Nhấn để chọn ảnh</span> hoặc kéo thả
                            </p>
                        </div>
                        <input
                            id='dropzone-file'
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={previewImage}
                        />
                    </label>
                </div>
                <div
                    className='flex flex-initial justify-center items-center w-3/6 rounded-lg border-2 border-gray-300 border-dashed overflow-hidden relative'
                    style={{ maxHeight: "119px" }}
                >
                    <img id='imagePreview' src='' alt='' className='object-contain' />

                    <button
                        id='removePreviewImage'
                        type='button'
                        className={`${tailwindCss.modal.closeButton} absolute top-0 right-0 hidden`}
                        onClick={removePreviewImage}
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuestionModalBody;
