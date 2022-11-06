import React from "react";
import { useSelector } from "react-redux";
import { clearErrorField, questionState, setEditedQuestion } from "../../features/questionSlice";
import { tailwindCss } from "../../tailwind";
import { TextArea, Select, FileInput } from "..";
import { QuestionExcelModalBody } from "..";
import { chapterState } from "../../features/chapterSlice";
import { lookupQuestionLevel } from "./QuestionTableBody";
import { subjectState } from "../../features/subjectSlice";
import { useFieldArray } from "react-hook-form";
import $ from "jquery";

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

const types = [
    {
        value: "Một đáp án",
        title: "Một đáp án",
    },
    {
        value: "Nhiều đáp án",
        title: "Nhiều đáp án",
    },
];

function QuestionModalBody({ errors, register, dispatch, setValue, setImage, isEdit, control }) {
    const { editedQuestion, errorObject, excelAdd } = useSelector(questionState);
    const { chapters } = useSelector(chapterState);
    const { subjects } = useSelector(subjectState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
    };

    if (isEdit && editedQuestion) {
        setValue("id", editedQuestion.id);
        setValue("content", editedQuestion.content);
    }

    const { fields, append, remove } = useFieldArray({
        control,
        name: "answers",
    });

    const handleSubjectChange = event => {
        console.log(event.target.value);
    };

    function lookupIndex(index) {
        const alphabet = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
        ];
        return alphabet[index];
    }

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
                        <div className='w-full grid grid-cols-2 gap-2 mt-5'>
                            {fields.map((field, index) => (
                                <div className='flex items-center' key={index}>
                                    <div className='flex items-center w-full'>
                                        <div className='flex-1 mr-5'>
                                            <TextArea
                                                label={`${lookupIndex(index)} *`}
                                                labelClassName={tailwindCss.label}
                                                textAreaClassName={tailwindCss.textArea}
                                                register={register}
                                                name={`answers.${index}.${lookupIndex(
                                                    index
                                                )}.content`}
                                            />
                                            <input
                                                type='hidden'
                                                {...register(
                                                    `answers.${index}.${lookupIndex(
                                                        index
                                                    )}.isAnswer`
                                                )}
                                            />
                                        </div>
                                        <div className='col-flex mb-1 ml-2'>
                                            <button
                                                type='button'
                                                className={tailwindCss.greenOutlineButton}
                                                onClick={event => {
                                                    const self = $(event.target);
                                                    if (self.hasClass("chosen")) {
                                                        setValue(
                                                            `answers.${index}.${lookupIndex(
                                                                index
                                                            )}.isAnswer`,
                                                            false
                                                        );
                                                        self.prop(
                                                            "className",
                                                            tailwindCss.greenOutlineButton
                                                        );
                                                    } else {
                                                        setValue(
                                                            `answers.${index}.${lookupIndex(
                                                                index
                                                            )}.isAnswer`,
                                                            true
                                                        );
                                                        self.prop(
                                                            "className",
                                                            tailwindCss.greenFullButton + " chosen"
                                                        );
                                                    }
                                                }}
                                            >
                                                Đáp án
                                            </button>
                                            <button
                                                type='button'
                                                className={tailwindCss.deleteOutlineButton}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setValue(
                                                        `answers.${index}.${lookupIndex(
                                                            index
                                                        )}.content`,
                                                        ""
                                                    );
                                                    setValue(
                                                        `answers.${index}.${lookupIndex(
                                                            index
                                                        )}.isAnswer`,
                                                        false
                                                    );
                                                    remove(index);
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='self-start mt-5'>
                            <button
                                type='button'
                                className={tailwindCss.greenOutlineButton}
                                onClick={() => {
                                    append();
                                }}
                            >
                                Thêm câu trả lời
                            </button>
                        </div>

                        <div className='flex items-center w-full my-3'>
                            <div className='mr-5 w-full'>
                                <Select
                                    label='Loại câu hỏi'
                                    labelClassName={tailwindCss.label}
                                    selectClassName={tailwindCss.select}
                                    register={register}
                                    name='type'
                                    options={types}
                                    setValue={setValue}
                                />
                            </div>
                            <div className='w-full'>
                                <Select
                                    label='Độ khó *'
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

                        <div className='flex items-center w-full my-3'>
                            <div className='mr-5 w-full'>
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
                            <div className='w-full'>
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
