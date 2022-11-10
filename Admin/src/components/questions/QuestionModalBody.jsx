import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { clearErrorField, questionState } from "../../features/questionSlice";
import { tailwindCss } from "../../tailwind";
import { TextArea, Select, FileInput, Input } from "..";
import { QuestionExcelModalBody } from "..";
import { chapterState, fetchAllChapters } from "../../features/chapterSlice";
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
    {
        value: "Đáp án điền",
        title: "Đáp án điền",
    },
];

function QuestionModalBody({
    errors,
    register,
    dispatch,
    setValue,
    setImage,
    control,
    clearErrors,
}) {
    const { editedQuestion, errorObject, excelAdd } = useSelector(questionState);
    const { chapters } = useSelector(chapterState);
    const { subjects } = useSelector(subjectState);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "answers",
    });

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (name === "typedAnswer") {
            clearErrors("typedAnswer");
        }
    };

    useEffect(() => {
        if (editedQuestion) {
            setValue("id", editedQuestion.id);
            setValue("content", editedQuestion.content);
            handleTypeChange({ target: { value: editedQuestion.type } });
            if (editedQuestion.type === "Đáp án điền") {
                if (editedQuestion.answers[0]) {
                    setValue("typedAnswer", editedQuestion.answers[0].content);
                    setValue("typedId", editedQuestion.answers[0].id);
                }
            } else {
                editedQuestion.answers.forEach(({ id, content, answer }) => {
                    append({ id, content: content.slice(3), isAnswer: answer });
                });
            }
        } else {
            setValue("id", "");
            setValue("content", "");

            console.log("called");
            fields.forEach((_, index) => {
                remove(index);
            });
            fields.length = 0;
            setValue("answers", []);
        }
    }, [editedQuestion]);

    const handleSubjectChange = event => {
        event.preventDefault();
        dispatch(fetchAllChapters({ page: 0, subject: event.target.value }));
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

    const handleTypeChange = event => {
        console.log("asdas");

        if (event.target.value === "Đáp án điền") {
            $("#addAnswerButton").css("display", "none");
            $("#typedAnswerContainer").css("display", "block");
            $("#hide-this-for-me").css("display", "none");
            fields.forEach((_, index) => {
                remove(index);
            });
            fields.length = 0;
        } else {
            $("#addAnswerButton").css("display", "block");
            $("#typedAnswerContainer").css("display", "none");
            $("#hide-this-for-me").css("display", "block");
            setValue("typedAnswer", "");
        }
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
                        <input type='hidden' {...register("typedId")} />
                        <div className='w-full my-5 hidden' id='typedAnswerContainer'>
                            <Input
                                label='Đáp án *'
                                error={errors.typedAnswer && errors.typedAnswer.message}
                                register={register}
                                name='typedAnswer'
                                onKeyDown={onKeyDown}
                            />
                        </div>
                        {fields.length > 0 && (
                            <div className={`w-full grid grid-cols-2 gap-2 mt-5`}>
                                {fields.map((field, index) => {
                                    return (
                                        <div className='flex items-center' key={index}>
                                            <div className='flex items-center w-full'>
                                                <div className='flex-1 mr-5'>
                                                    <input
                                                        type='hidden'
                                                        {...register(`answers.${index}.id`)}
                                                    />
                                                    <input
                                                        type='hidden'
                                                        {...register(`answers.${index}.name`)}
                                                        value={lookupIndex(index)}
                                                    />
                                                    <TextArea
                                                        label={`${lookupIndex(index)} *`}
                                                        labelClassName={tailwindCss.label}
                                                        textAreaClassName={tailwindCss.textArea}
                                                        register={register}
                                                        name={`answers.${index}.content`}
                                                    />
                                                    <input
                                                        type='hidden'
                                                        {...register(`answers.${index}.isAnswer`)}
                                                    />
                                                </div>
                                                <div className='col-flex mb-1 ml-2'>
                                                    <button
                                                        type='button'
                                                        className={
                                                            field.isAnswer
                                                                ? tailwindCss.greenFullButton +
                                                                  " chosen"
                                                                : tailwindCss.greenOutlineButton
                                                        }
                                                        onClick={event => {
                                                            const self = $(event.target);
                                                            if (self.hasClass("chosen")) {
                                                                setValue(
                                                                    `answers.${index}.isAnswer`,
                                                                    false
                                                                );
                                                                self.prop(
                                                                    "className",
                                                                    tailwindCss.greenOutlineButton
                                                                );
                                                            } else {
                                                                if (
                                                                    $("#type").val() ===
                                                                    "Một đáp án"
                                                                ) {
                                                                    if ($(".chosen").length === 0) {
                                                                        setValue(
                                                                            `answers.${index}.isAnswer`,
                                                                            true
                                                                        );
                                                                        self.prop(
                                                                            "className",
                                                                            tailwindCss.greenFullButton +
                                                                                " chosen"
                                                                        );
                                                                    }
                                                                } else {
                                                                    setValue(
                                                                        `answers.${index}.isAnswer`,
                                                                        true
                                                                    );
                                                                    self.prop(
                                                                        "className",
                                                                        tailwindCss.greenFullButton +
                                                                            " chosen"
                                                                    );
                                                                }
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
                                    );
                                })}
                            </div>
                        )}
                        <div className='self-start mt-5' id='hide-this-for-me'>
                            <button
                                id='addAnswerButton'
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
                                    register={register}
                                    name='type'
                                    options={types}
                                    setValue={setValue}
                                    onChangeHandler={handleTypeChange}
                                    defaultValue={editedQuestion && editedQuestion.type}
                                />
                            </div>
                            <div className='w-full'>
                                <Select
                                    label='Độ khó *'
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
                                    register={register}
                                    name='subject'
                                    options={subjects.map(subject => ({
                                        title: subject.name,
                                        value: subject.id,
                                    }))}
                                    setValue={setValue}
                                    onChangeHandler={handleSubjectChange}
                                    defaultValue={
                                        editedQuestion && editedQuestion.chapter.subject.id
                                    }
                                />
                            </div>
                            <div className='w-full'>
                                <Select
                                    label='Chương *'
                                    register={register}
                                    name='chapterId'
                                    error={errors.chapterId && errors.chapterId.message}
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
