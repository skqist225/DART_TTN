import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Form, Frame, Select, TextArea } from "../../components";
import { questionSchema } from "../../validation";
import { tailwindCss } from "../../tailwind";

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
        resolver: yupResolver(questionSchema),
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
    };

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"THÊM CÂU HỎI"}
            children={
                <Form
                    id='addQuestionForm'
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    children={<FormBody errors={errors} register={register} />}
                    tailwindCss={tailwindCss}
                />
            }
        />
    );
};

export default AddQuestionPage;
