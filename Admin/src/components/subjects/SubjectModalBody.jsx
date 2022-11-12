import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { clearErrorField, setEditedSubject, subjectState } from "../../features/subjectSlice";
import Input from "../utils/userInputs/Input";

function SubjectModalBody({ errors, register, dispatch, setValue, clearErrors }) {
    const { editedSubject, errorObject } = useSelector(subjectState);

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
            setValue("id", editedSubject.id);
            setValue("name", editedSubject.name);
            setValue("numberOfTheoreticalPeriods", editedSubject.numberOfTheoreticalPeriods);
            setValue("numberOfPracticePeriods", editedSubject.numberOfPracticePeriods);
        } else {
            setValue("id", "");
            setValue("name", "");
            setValue("numberOfTheoreticalPeriods", "");
            setValue("numberOfPracticePeriods", "");
        }
    }, [editedSubject]);

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full my-5'>
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

                <div className='w-full my-5 flex items-center'>
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
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubjectModalBody;
