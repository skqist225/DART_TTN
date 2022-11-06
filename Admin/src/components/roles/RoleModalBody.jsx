import React from "react";
import { useSelector } from "react-redux";
import { roleState } from "../../features/roleSlice";
import { clearErrorField } from "../../features/roleSlice";
import Input from "../utils/userInputs/Input";

function RoleModalBody({ errors, register, dispatch, setValue }) {
    const { editedRole, errorObject } = useSelector(roleState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
    };

    if (editedRole) {
        setValue("id", editedRole.id);
        setValue("name", editedRole.name);
    }

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <input type='hidden' {...register("id")} />

                <div className='w-full my-5'>
                    <Input
                        label='Tên vai trò *'
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

export default RoleModalBody;
