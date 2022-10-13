import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { tailwindCss } from "../../tailwind";
import Select from "../utils/userInputs/Select";

import { CloseIcon } from "../../images";
import Input from "../utils/userInputs/Input";
import { userState } from "../../features/user/userSlice";
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

function QuestionModalBody({ errors, register, dispatch, setValue, subjects, setImage }) {
    const { editedUser, errorObject } = useSelector(userState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        // if (editedUser) {
        //     dispatch(setEditedQuestion(null));
        // }
    };

    // if (editedQuestion) {
    //     setValue("id", editedQuestion.id);
    //     setValue("content", editedQuestion.content);
    //     setValue("answerA", editedQuestion.answerA);
    //     setValue("answerB", editedQuestion.answerB);
    //     setValue("answerC", editedQuestion.answerC);
    //     setValue("answerD", editedQuestion.answerD);
    //     setValue("finalAnswer", editedQuestion.finalAnswer);
    //     setValue("level", editedQuestion.level);
    //     setValue("subjectId", editedQuestion.subject.id);
    // }

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
                <div className='w-full flex items-center mb-5'>
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
                <div className='w-full mb-5'>
                    <div>
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
                </div>
                <div className='w-full mb-5'>
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
                <div className='w-full mb-5'>
                    <DatePicker />
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
                <div className='w-full mb-5'>
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
                <div className='w-full mb-5'>
                    {/* <Select
                        label='Lớp *'
                        labelClassName={tailwindCss.label}
                        selectClassName={tailwindCss.select}
                        error={errors.subjectId && errors.subjectId.message}
                        register={register}
                        name='subjectId'
                        options={subjects}
                    /> */}
                </div>
            </div>

            <div className='mt-3'>
                <label htmlFor='countries' className={tailwindCss.label}>
                    Hình ảnh <span id='imagePreviewName'></span>
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
                        // onClick={removePreviewImage}
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuestionModalBody;
