import React from "react";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { chapterState } from "../../features/chapterSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { clearErrorField, subjectState } from "../../features/subjectSlice";
import { tailwindCss } from "../../tailwind";
import Input from "../utils/userInputs/Input";

function SubjectModalBody({ errors, register, dispatch, setValue, clearErrors, control }) {
    const { editedSubject, errorObject } = useSelector(subjectState);
    const { errorObject: chapterErrorObject } = useSelector(chapterState);
    const { user } = useSelector(persistUserState);
    const { fields, append, remove, insert } = useFieldArray({
        control,
        name: "chapters",
    });

    useEffect(() => {
        if (chapterErrorObject) {
            Object.keys(chapterErrorObject).forEach(key => {
                setError(key, {
                    type: "custom",
                    message: chapterErrorObject[key],
                });
            });
        }
    }, [chapterErrorObject]);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (name === "numberOfPracticePeriods" || name === "numberOfTheoreticalPeriods") {
            clearErrors("numberOfPracticePeriods");
            clearErrors("numberOfTheoreticalPeriods");
        }
    };

    useEffect(() => {
        if (editedSubject) {
            console.info(editedSubject);
            setValue("id", editedSubject.id);
            setValue("name", editedSubject.name);
            setValue("numberOfTheoreticalPeriods", editedSubject.numberOfTheoreticalPeriods);
            setValue("numberOfPracticePeriods", editedSubject.numberOfPracticePeriods);

            // let insertedIndex = [];

            editedSubject.chapters.forEach(
                ({ id, name, chapterNumber, tempQuestions: questions }, index) => {
                    append({ id, name, chapterNumber, active: questions.length !== 0 });
                    // insert(chapterNumber - 1, { id, name, chapterNumber });
                    // insertedIndex.push(chapterNumber - 1);
                }
            );

            // for (let i = 0; i < insertedIndex.length; i++) {
            //     if (!insertedIndex.includes(i)) {
            //         insert(i, {});
            //     }
            // }
        } else {
            setValue("id", "");
            setValue("name", "");
            setValue("numberOfTheoreticalPeriods", "");
            setValue("numberOfPracticePeriods", "");

            setValue("chapters", []);
            clearErrors("chapters");
        }
    }, [editedSubject]);

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div
                    className={`flex w-full ${
                        errors.id || errors.name ? "items-start" : "items-center"
                    }`}
                >
                    <div className='w-full mr-5'>
                        <Input
                            label='Mã môn học *'
                            error={
                                (errors.id && errors.id.message) || (errorObject && errorObject.id)
                            }
                            register={register}
                            name='id'
                            onKeyDown={onKeyDown}
                            readOnly={editedSubject}
                        />
                    </div>
                    <div className='w-full'>
                        <Input
                            label='Tên môn học *'
                            error={
                                (errors.name && errors.name.message) ||
                                (errorObject && errorObject.name)
                            }
                            register={register}
                            name='name'
                            onKeyDown={onKeyDown}
                            readOnly={!user.roles.map(({ name }) => name).includes("Quản trị viên")}
                        />
                    </div>
                </div>

                <div
                    className={`flex w-full my-5 ${
                        errors.numberOfTheoreticalPeriods || errors.numberOfPracticePeriods
                            ? "items-start"
                            : "items-center"
                    }`}
                >
                    <div className='w-full mr-5'>
                        <Input
                            label='Số tiết lý thuyết *'
                            error={
                                errors.numberOfTheoreticalPeriods &&
                                errors.numberOfTheoreticalPeriods.message
                            }
                            register={register}
                            name='numberOfTheoreticalPeriods'
                            onKeyDown={onKeyDown}
                            readOnly={!user.roles.map(({ name }) => name).includes("Quản trị viên")}
                        />
                    </div>

                    <div className='w-full'>
                        <Input
                            label='Số tiết thực hành *'
                            error={
                                errors.numberOfPracticePeriods &&
                                errors.numberOfPracticePeriods.message
                            }
                            register={register}
                            name='numberOfPracticePeriods'
                            onKeyDown={onKeyDown}
                            readOnly={!user.roles.map(({ name }) => name).includes("Quản trị viên")}
                        />
                    </div>
                </div>
                <h3 className='uppercase text-blue-500 font-semibold'>Danh sách chương</h3>
                {fields.length > 0 && (
                    <div className={`w-full grid grid-cols-2 gap-2 mt-5`}>
                        {fields.map((field, index) => {
                            return (
                                <div className='flex items-center' key={field.id}>
                                    <div
                                        className={`flex ${
                                            errors.chapters ? "items-center" : "items-end"
                                        } w-full`}
                                    >
                                        <div className='flex-1 mr-5'>
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
                                            className={`${tailwindCss.deleteOutlineButton} ${
                                                field.active &&
                                                "cursor-not-allowed hover:text-red-700 hover:bg-white"
                                            }`}
                                            onClick={e => {
                                                e.preventDefault();

                                                setValue(`chapters.${index}.name`, "");
                                                clearErrors(`chapters.${index}.name`);

                                                remove(index);
                                            }}
                                            disabled={field.active}
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

export default SubjectModalBody;
