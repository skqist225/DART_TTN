import React from "react";
import { useSelector } from "react-redux";
import { clearErrorField, questionState, setEditedQuestion } from "../../features/questionSlice";
import { tailwindCss } from "../../tailwind";
import Select from "../utils/userInputs/Select";
import TextArea from "../utils/userInputs/TextArea";
import $ from "jquery";
import { CloseIcon } from "../../images";
import { QuestionExcelModalBody } from "..";
import { Input } from "..";
import { subjectState } from "../../features/subjectSlice";
import { chapterState } from "../../features/chapterSlice";

const finalAnswerOptions = [
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

function QuestionModalBody({ errors, register, dispatch, setValue, setImage }) {
    const { editedQuestion, errorObject, excelAdd } = useSelector(questionState);
    const { chapters } = useSelector(chapterState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (editedQuestion) {
            dispatch(setEditedQuestion(null));
        }
    };

    if (editedQuestion) {
        setValue("id", editedQuestion.id);
        setValue("content", editedQuestion.content);
        setValue("answerA", editedQuestion.answerA);
        setValue("answerB", editedQuestion.answerB);
        setValue("answerC", editedQuestion.answerC);
        setValue("answerD", editedQuestion.answerD);
        setValue("finalAnswer", editedQuestion.finalAnswer);
        setValue("level", editedQuestion.level);
        setValue("chapter", editedQuestion.chapter);
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
            {!excelAdd ? (
                <div>
                    <div className='col-flex items-center justify-center w-full'>
                        <div className='w-full'>
                            <TextArea
                                label='Nội dung câu hỏi *'
                                labelClassName={tailwindCss.label}
                                textAreaClassName={tailwindCss.textArea}
                                error={
                                    (errors.content && errors.content.message) ||
                                    (errorObject && errorObject.content)
                                }
                                register={register}
                                name='content'
                                onKeyDown={onKeyDown}
                            />
                        </div>
                        <div className='w-full'>
                            <div className='flex my-5'>
                                <div className='flex-1 mr-5'>
                                    <TextArea
                                        label='A *'
                                        labelClassName={tailwindCss.label}
                                        textAreaClassName={tailwindCss.textArea}
                                        error={errors.answerA && errors.answerA.message}
                                        register={register}
                                        name='answerA'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <TextArea
                                        label='B *'
                                        labelClassName={tailwindCss.label}
                                        textAreaClassName={tailwindCss.textArea}
                                        error={errors.answerB && errors.answerB.message}
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
                                        error={errors.answerC && errors.answerC.message}
                                        register={register}
                                        name='answerC'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <TextArea
                                        label='D *'
                                        labelClassName={tailwindCss.label}
                                        textAreaClassName={tailwindCss.textArea}
                                        error={errors.answerD && errors.answerD.message}
                                        register={register}
                                        name='answerD'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center w-full'>
                            <div className='my-3 w-full mr-5'>
                                <Select
                                    label='Đáp án *'
                                    labelClassName={tailwindCss.label}
                                    selectClassName={tailwindCss.select}
                                    error={errors.finalAnswer && errors.finalAnswer.message}
                                    register={register}
                                    name='finalAnswer'
                                    options={finalAnswerOptions}
                                    setValue={setValue}
                                />
                            </div>

                            <div className='my-3 w-full'>
                                <Select
                                    label='Mức độ *'
                                    labelClassName={tailwindCss.label}
                                    selectClassName={tailwindCss.select}
                                    error={errors.level && errors.level.message}
                                    register={register}
                                    name='level'
                                    options={levelOptions}
                                    setValue={setValue}
                                />
                            </div>
                        </div>

                        <div className='flex items-center w-full'>
                            <div className='my-3 w-full'>
                                <Select
                                    label='Chương *'
                                    labelClassName={tailwindCss.label}
                                    selectClassName={tailwindCss.select}
                                    error={errors.chapterId && errors.chapterId.message}
                                    register={register}
                                    name='chapterId'
                                    options={chapters.map(chapter => ({
                                        title: chapter.name,
                                        value: chapter.id,
                                    }))}
                                    setValue={setValue}
                                />
                            </div>
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
                                        <span className='font-semibold'>Nhấn để chọn ảnh</span> hoặc
                                        kéo thả
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
            ) : (
                <QuestionExcelModalBody />
            )}
        </div>
    );
}

export default QuestionModalBody;
