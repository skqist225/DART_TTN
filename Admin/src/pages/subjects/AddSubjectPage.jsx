import React from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Frame, Form, Input } from "../../components";
import { tailwindCss } from "../../tailwind";
import { subjectSchema } from "../../validation";

const FormBody = ({ errors, register }) => {
    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full'>
                    <Input
                        label='Mã môn học *'
                        labelClassName={tailwindCss.label}
                        inputClassname={tailwindCss.input}
                        error={errors.id}
                        register={register}
                        name='id'
                    />
                </div>
                <div className='w-full my-5'>
                    <Input
                        label='Tên môn học *'
                        labelClassName={tailwindCss.label}
                        inputClassname={tailwindCss.input}
                        error={errors.name}
                        register={register}
                        name='name'
                    />
                </div>
            </div>
        </div>
    );
};

const AddSubjectPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [image, setImage] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(subjectSchema),
    });

    const onSubmit = (data, e) => {
        const { id, name } = data;
    };

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"THÊM MÔN HỌC"}
            children={
                <Form
                    id='addSubjectForm'
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    children={<FormBody errors={errors} register={register} />}
                    tailwindCss={tailwindCss}
                />
            }
        />
    );
};

export default AddSubjectPage;
