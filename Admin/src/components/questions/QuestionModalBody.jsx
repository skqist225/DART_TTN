import React from "react";
import { useSelector } from "react-redux";
import { clearErrorField, questionState, setEditedQuestion } from "../../features/questionSlice";
import { tailwindCss } from "../../tailwind";
import { TextArea, Select, FileInput } from "..";
import { QuestionExcelModalBody } from "..";
import { chapterState } from "../../features/chapterSlice";
import { lookupQuestionLevel } from "./QuestionTableBody";
import { subjectState } from "../../features/subjectSlice";

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

export const levelOptions = [
    {
        value: "Dễ",
        title: "Dễ",
    },
    {
        value: "Trung bình",
        title: "Trung bình",
    },
    {
        value: "Khó",
        title: "Khó",
    },
];

function QuestionModalBody({ errors, register, dispatch, setValue, setImage, isEdit }) {
    const { editedQuestion, errorObject, excelAdd } = useSelector(questionState);
    const { chapters } = useSelector(chapterState);
    const { subjects } = useSelector(subjectState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        // if (editedQuestion) {
        //     dispatch(setEditedQuestion(null));
        // }
    };

    if (isEdit && editedQuestion) {
        setValue("id", editedQuestion.id);
        setValue("content", editedQuestion.content);
        setValue("answerA", editedQuestion.answerA);
        setValue("answerB", editedQuestion.answerB);
        setValue("answerC", editedQuestion.answerC);
        setValue("answerD", editedQuestion.answerD);
    }

    const handleSubjectChange = event => {
        console.log(event.target.value);
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
                                        label='C *'
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
                                    register={register}
                                    name='finalAnswer'
                                    options={finalAnswerOptions}
                                    setValue={setValue}
                                    defaultValue={editedQuestion && editedQuestion.finalAnswer}
                                />
                            </div>

                            <div className='my-3 w-full'>
                                <Select
                                    label='Mức độ *'
                                    labelClassName={tailwindCss.label}
                                    selectClassName={tailwindCss.select}
                                    register={register}
                                    name='level'
                                    options={levelOptions}
                                    setValue={setValue}
                                    defaultValue={
                                        editedQuestion && lookupQuestionLevel(editedQuestion.level)
                                    }
                                />
                            </div>
                        </div>

                        <div className='flex items-center w-full'>
                            <div className='my-3 mr-5 w-full'>
                                <Select
                                    label='Môn học'
                                    labelClassName={tailwindCss.label}
                                    selectClassName={tailwindCss.select}
                                    register={register}
                                    name='subject'
                                    options={subjects.map(subject => ({
                                        title: subject.name,
                                        value: subject.id,
                                    }))}
                                    setValue={setValue}
                                    onChangeHandler={handleSubjectChange}
                                />
                            </div>
                            <div className='my-3 w-full'>
                                <Select
                                    label='Chương *'
                                    labelClassName={tailwindCss.label}
                                    selectClassName={tailwindCss.select}
                                    register={register}
                                    name='chapterId'
                                    options={chapters.map(chapter => ({
                                        title: chapter.name,
                                        value: chapter.id,
                                    }))}
                                    setValue={setValue}
                                    defaultValue={editedQuestion && editedQuestion.chapter.id}
                                />
                            </div>
                        </div>
                    </div>
                    <FileInput setImage={setImage} />
                </div>
            ) : (
                <QuestionExcelModalBody />
            )}
        </div>
    );
}

export default QuestionModalBody;
