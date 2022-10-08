import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Frame, Form, Input } from "../../components";
import { tailwindCss } from "../../tailwind";
import { subjectSchema } from "../../validation";
import {
    addSubject,
    clearAddSubjectState,
    clearErrorField,
    subjectState,
} from "../../features/subjectSlice";
import { useSelector } from "react-redux";
import { callToast } from "../../helpers";
import $ from "jquery";

const FormBody = ({ errors, register, errorObject, dispatch }) => {
    const onKeyDown = ({ target: { name } }) => {
        dispatch(clearErrorField(name));
    };

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full'>
                    <Input
                        label='Mã môn học *'
                        labelClassName={tailwindCss.label}
                        inputClassname={tailwindCss.input}
                        error={(errors.id && errors.id.message) || (errorObject && errorObject.id)}
                        register={register}
                        name='id'
                        onKeyDown={onKeyDown}
                    />
                </div>
                <div className='w-full my-5'>
                    <Input
                        label='Tên môn học *'
                        labelClassName={tailwindCss.label}
                        inputClassname={tailwindCss.input}
                        error={
                            (errors.name && errors.name.message) ||
                            (errorObject && errorObject.name)
                        }
                        register={register}
                        name='name'
                        onKeyDown={onKeyDown}
                    />
                </div>
            </div>
        </div>
    );
};

const AddSubjectPage = () => {
    const dispatch = useDispatch();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {
        addSubject: { successMessage, errorObject },
    } = useSelector(subjectState);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(subjectSchema),
    });

    const onSubmit = data => {
        dispatch(addSubject(data));
    };

    useEffect(() => {
        return () => {
            dispatch(clearAddSubjectState());
        };
    }, []);

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            $("#addSubjectForm")[0].reset();
        }
    }, [successMessage]);

    return (
        <>
            <Frame
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                title={"THÊM MÔN HỌC"}
                children={
                    <Form
                        id='addSubjectForm'
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        children={
                            <FormBody
                                errors={errors}
                                register={register}
                                errorObject={errorObject}
                                dispatch={dispatch}
                            />
                        }
                        tailwindCss={tailwindCss}
                    />
                }
            />
        </>
    );
};

export default AddSubjectPage;
