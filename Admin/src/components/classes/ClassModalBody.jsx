import React from "react";
import { useSelector } from "react-redux";
import { clearErrorField, setEditedClass, classState } from "../../features/classSlice";
import Input from "../utils/userInputs/Input";

function ClassModalBody({ errors, register, dispatch, setValue }) {
    const { editedClass, errorObject } = useSelector(classState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (editedClass) {
            dispatch(setEditedClass(null));
        }
    };

    if (editedClass) {
        setValue("id", editedClass.id);
        setValue("name", editedClass.name);
    }

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full'>
                    <Input
                        label='Mã Lớp *'
                        error={(errors.id && errors.id.message) || (errorObject && errorObject.id)}
                        register={register}
                        name='id'
                        onKeyDown={onKeyDown}
                        readOnly={editedClass}
                    />
                </div>
                <div className='w-full my-5'>
                    <Input
                        label='Tên lớp *'
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

export default ClassModalBody;
