import React from "react";
import { useSelector } from "react-redux";
import { clearErrorField, chapterState, setEditedChapter } from "../../features/chapterSlice";
import { subjectState } from "../../features/subjectSlice";
import { tailwindCss } from "../../tailwind";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";

function ChapterModalBody({ errors, register, dispatch, setValue }) {
    const { subjects } = useSelector(subjectState);
    const { editedChapter, errorObject } = useSelector(chapterState);

    console.log(subjects);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (editedChapter) {
            dispatch(setEditedChapter(null));
        }
    };

    if (editedChapter) {
        setValue("id", editedChapter.id);
        setValue("name", editedChapter.name);
    }

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full my-5'>
                    <Input
                        label='Tên chương *'
                        error={
                            (errors.name && errors.name.message) ||
                            (errorObject && errorObject.name)
                        }
                        register={register}
                        name='name'
                        onKeyDown={onKeyDown}
                    />
                </div>
                <div className='w-full my-5'>
                    <Select
                        label='Môn học *'
                        labelClassName={tailwindCss.label}
                        selectClassName={tailwindCss.select}
                        error={errors.subjectId && errors.subjectId.message}
                        register={register}
                        name='subjectId'
                        options={subjects.map(subject => ({
                            title: subject.name,
                            value: subject.id,
                        }))}
                        setValue={setValue}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChapterModalBody;
