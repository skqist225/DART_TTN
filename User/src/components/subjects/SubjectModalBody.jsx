import React from "react";
import { useSelector } from "react-redux";
import { clearErrorField, setEditedsubject, subjectState } from "../../features/subjectSlice";
import Input from "../utils/userInputs/Input";

function SubjectModalBody({ errors, register, dispatch, setValue }) {
    const { editedSubject, errorObject } = useSelector(subjectState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (editedSubject) {
            dispatch(setEditedsubject(null));
        }
    };

    if (editedSubject) {
        setValue("id", editedSubject.id);
        setValue("name", editedSubject.name);
    }

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full'>
                    <Input
                        label='Mã môn học *'
                        error={(errors.id && errors.id.message) || (errorObject && errorObject.id)}
                        register={register}
                        name='id'
                        onKeyDown={onKeyDown}
                        readOnly={editedSubject}
                    />
                </div>
                <div className='w-full my-5'>
                    <Input
                        label='Tên môn học *'
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
}

export default SubjectModalBody;
