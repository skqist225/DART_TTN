import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";

import Box from "@mui/material/Box";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ErrorMessage, Select, TextArea } from "../components";

const tailwindCss = {
    textArea:
        "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
    label: "block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300",
    select: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
    button: "text-white text-center bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-[#3b5998]/55 mr-2 mb-2 w-full",
    dropZoneLabel:
        "flex flex-col justify-center items-center w-full h-28 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
};

const schema = yup
    .object({
        content: yup.string().required("Vui lòng điền nội dung câu hỏi"),
        answerA: yup.string().required("Vui lòng điền đáp án A"),
        answerB: yup.string().required("Vui lòng điền đáp án B"),
        answerC: yup.string().required("Vui lòng điền đáp án C"),
        answerD: yup.string().required("Vui lòng điền đáp án D"),
        finalAnswer: yup.string().required("Vui lòng chọn đáp án"),
        level: yup.string().required("Vui lòng chọn mức độ câu hỏi"),
    })
    .required();

const AddQuestionPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [image, setImage] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data, e) => {
        const formData = new FormData();
        const { content, answerA, answerB, answerC, answerD, finalAnswer, level } = data;

        formData.set("content", content);
        formData.set("answerA", answerA);
        formData.set("answerB", answerB);
        formData.set("answerC", answerC);
        formData.set("answerD", answerD);
        formData.set("finalAnswer", finalAnswer);
        formData.set("level", level);

        // if(data.image) {
        //            formData.set("image", content);
        // }

        console.log(data);
    };

    // const { user } = useSelector(userState);

    // const clearFields = () => {
    //     $("#addUserForm")[0].reset();
    // };

    //     setValues({
    //         ...values,
    //         [e.target.name]: e.target.value,
    //     });
    // };

    // useEffect(() => {
    //     if (araSuccessMessage) {
    //         navigate("/rooms");
    //     }
    // }, [araSuccessMessage]);

    const finalAnswerOptions = [
        {
            value: "",
            title: "Chọn đáp án",
        },
        {
            value: "A",
            title: "A",
        },
        {
            value: "B",
            title: "B",
        },
        {
            value: "C",
            title: "C",
        },
        {
            value: "D",
            title: "D",
        },
    ];

    const levelOptions = [
        {
            value: "",
            title: "Chọn mức độ",
        },
        {
            value: "EASY",
            title: "Dễ",
        },
        {
            value: "MEDIUM",
            title: "Trung bình",
        },
        {
            value: "HARD",
            title: "Khó",
        },
    ];

    return (
        <>
            <div className='flex h-screen overflow-hidden'>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                    <Box sx={{ width: "80%", marginTop: "20px", margin: "0 auto" }}>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                handleSubmit(onSubmit)(e);
                            }}
                            id='addQuestionForm'
                        >
                            <div className='mt-5'>
                                <div className='col-flex items-center justify-center w-full'>
                                    <div className='w-full'>
                                        <TextArea
                                            label='Nội dung câu hỏi *'
                                            labelClassName={tailwindCss.label}
                                            textAreaClassName={tailwindCss.textArea}
                                            error={errors.content}
                                            register={register}
                                            name='content'
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <div className='flex my-5'>
                                            <div className='flex-1 mr-5'>
                                                <TextArea
                                                    label='A *'
                                                    labelClassName={tailwindCss.label}
                                                    textAreaClassName={tailwindCss.textArea}
                                                    error={errors.answerA}
                                                    register={register}
                                                    name='answerA'
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <TextArea
                                                    label='B *'
                                                    labelClassName={tailwindCss.label}
                                                    textAreaClassName={tailwindCss.textArea}
                                                    error={errors.answerB}
                                                    register={register}
                                                    name='answerB'
                                                />
                                            </div>
                                        </div>
                                        <div className='flex'>
                                            <div className='flex-1 mr-5'>
                                                <TextArea
                                                    label='B *'
                                                    labelClassName={tailwindCss.label}
                                                    textAreaClassName={tailwindCss.textArea}
                                                    error={errors.answerC}
                                                    register={register}
                                                    name='answerC'
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <TextArea
                                                    label='D *'
                                                    labelClassName={tailwindCss.label}
                                                    textAreaClassName={tailwindCss.textArea}
                                                    error={errors.answerD}
                                                    register={register}
                                                    name='answerD'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='my-3 w-full'>
                                        <Select
                                            label='Đáp án *'
                                            labelClassName={tailwindCss.label}
                                            selectClassName={tailwindCss.select}
                                            error={errors.finalAnswer}
                                            register={register}
                                            name='finalAnswer'
                                            options={finalAnswerOptions}
                                        />
                                    </div>

                                    <div className='my-3 w-full'>
                                        <Select
                                            label='Mức độ *'
                                            labelClassName={tailwindCss.label}
                                            selectClassName={tailwindCss.select}
                                            error={errors.level}
                                            register={register}
                                            name='level'
                                            options={levelOptions}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='my-3'>
                                <label htmlFor='countries' className={tailwindCss.label}>
                                    Hình ảnh
                                </label>
                            </div>

                            <div className='flex justify-center items-center w-full'>
                                <label
                                    htmlFor='dropzone-file'
                                    className={tailwindCss.dropZoneLabel}
                                >
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
                                            <span className='font-semibold'>Nhấn để chọn ảnh</span>{" "}
                                            hoặc kéo thả
                                        </p>
                                    </div>
                                    <input
                                        id='dropzone-file'
                                        type='file'
                                        className='hidden'
                                        onChange={e => {
                                            setImage(e.target.files[0]);
                                        }}
                                    />
                                </label>
                            </div>

                            <div className='my-3'>
                                <button type='submit' className={tailwindCss.button}>
                                    Tạo câu hỏi
                                </button>
                            </div>
                        </form>
                    </Box>
                </div>
            </div>
        </>
    );
};

export default AddQuestionPage;
