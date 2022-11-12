import React, { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { chapterState } from "../../features/chapterSlice";
import { fetchAllSubjects, findSubject, subjectState } from "../../features/subjectSlice";
import { tailwindCss } from "../../tailwind";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";

function ChapterModalBody({
    errors,
    register,
    dispatch,
    setValue,
    control,
    clearErrors,
    setError,
}) {
    const { subjects, subject } = useSelector(subjectState);
    const { editedChapter, errorObject } = useSelector(chapterState);
    const { fields, append, remove } = useFieldArray({
        control,
        name: "chapters",
    });

    useEffect(() => {
        if (!editedChapter) {
            append();
        }
    }, []);

    useEffect(() => {
        if (errorObject) {
            Object.keys(errorObject).forEach(key => {
                setError(key, {
                    type: "custom",
                    message: errorObject[key],
                });
            });
        }
    }, [errorObject]);

    useEffect(() => {
        console.log(editedChapter);
        if (editedChapter) {
            editedChapter.subject.chapters.forEach(({ id, name }) => {
                append({ id, name: name.split(":")[1] });
            });
        } else {
            setValue("chapters", []);
            clearErrors("chapters");
        }
    }, [editedChapter]);

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full my-5'>
                    <Select
                        label='Môn học *'
                        error={errors.subjectId && errors.subjectId.message}
                        register={register}
                        name='subjectId'
                        options={
                            editedChapter
                                ? [editedChapter.subject].map(subject => ({
                                      title: subject.name,
                                      value: subject.id,
                                  }))
                                : subjects.map(subject => ({
                                      title: subject.name,
                                      value: subject.id,
                                  }))
                        }
                        setValue={setValue}
                        defaultValue={editedChapter && editedChapter.subject.id}
                    />
                </div>
                {fields.length > 0 && (
                    <div className={`w-full grid grid-cols-2 gap-2 mt-5`}>
                        {fields.map((field, index) => {
                            return (
                                <div className='flex items-center' key={index}>
                                    <div
                                        className={`flex ${
                                            errors.chapters ? "items-center" : "items-end"
                                        } w-full`}
                                    >
                                        <div className='flex-1 mr-5'>
                                            <input
                                                type='hidden'
                                                {...register(`chapters.${index}.index`)}
                                                value={index}
                                            />
                                            <input
                                                type='hidden'
                                                {...register(`chapters.${index}.id`)}
                                            />
                                            <Input
                                                label={`Chương ${index + 1}`}
                                                error={
                                                    errors.chapters &&
                                                    errors.chapters[`${index}`] &&
                                                    errors.chapters[`${index}`].name.message
                                                }
                                                register={register}
                                                name={`chapters.${index}.name`}
                                            />
                                        </div>
                                        <button
                                            type='button'
                                            className={tailwindCss.deleteOutlineButton}
                                            onClick={e => {
                                                e.preventDefault();
                                                setValue(`chapters.${index}.name`, "");
                                                clearErrors(`chapters.${index}.name`);
                                                remove(index);
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className='self-start mt-5' id='hide-this-for-me'>
                    <button
                        id='addChapterButton'
                        type='button'
                        className={tailwindCss.greenOutlineButton}
                        onClick={() => {
                            append();
                        }}
                    >
                        Thêm chương
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChapterModalBody;
