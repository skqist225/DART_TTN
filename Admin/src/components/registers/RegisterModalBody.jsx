import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { creditClassState } from "../../features/creditClassSlice";
import { userState } from "../../features/userSlice";
import { callToast } from "../../helpers";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";

const schoolYears = [
    {
        title: "2021-2022",
        value: "2021-2022",
    },
    {
        title: "2022-2023",
        value: "2022-2023",
    },
    {
        title: "2023-2024",
        value: "2023-2024",
    },
];

function RegisterModalBody({ errors, register, dispatch, setValue }) {
    const { editedCreditClass, errorObject } = useSelector(creditClassState);
    const { users } = useSelector(userState);

    useEffect(() => {
        if (editedCreditClass) {
            setValue("id", editedCreditClass.id);
            setValue("name", editedCreditClass.name);
        }
    }, [editedCreditClass]);

    const handleTypeChange = () => {};

    useEffect(() => {
        if (errorObject) {
            if (errorObject.uniqueKey) {
                callToast("error", errorObject.uniqueKey);
            }
        }
    }, [errorObject]);

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div className='flex items-center w-full my-3'>
                    <div className='mr-5 w-full'>
                        <Select
                            label='Niên khóa *'
                            register={register}
                            name='schoolYear'
                            options={schoolYears}
                            error={errors.schoolYear && errors.schoolYear.message}
                            setValue={setValue}
                            onChangeHandler={handleTypeChange}
                            defaultValue={"2021-2022"}
                        />
                    </div>
                    <div className='w-full'>
                        <Select
                            label='Học kỳ *'
                            register={register}
                            name='semester'
                            options={Array.from({ length: 4 }).map((_, index) => ({
                                title: index + 1,
                                value: index + 1,
                            }))}
                            error={errors.semester && errors.semester.message}
                            setValue={setValue}
                            defaultValue={1}
                        />
                    </div>
                </div>
                <div className='flex items-center w-full my-3'>
                    <div className='w-full'>
                        <Select
                            label='Số SV'
                            register={register}
                            name='group'
                            options={Array.from({ length: 10 }).map((_, index) => ({
                                title: index + 1,
                                value: index + 1,
                            }))}
                            error={errors.group && errors.group.message}
                            setValue={setValue}
                            defaultValue={1}
                        />
                    </div>
                </div>
                <div className='w-full my-5 flex items-center'>
                    <div className='w-full mr-5'>
                        <Select
                            label='Giảng viên *'
                            register={register}
                            name='teacherId'
                            options={users.map(({ id, fullName }) => ({
                                title: fullName,
                                value: id,
                            }))}
                            error={errors.teacherId && errors.teacherId.message}
                            setValue={setValue}
                            defaultValue={users && users.length && users[0].id}
                        />
                    </div>
                    <div className='w-full'>
                        <Input
                            label='Số SV tối thiểu *'
                            error={
                                errors.minimumNumberOfStudents &&
                                errors.minimumNumberOfStudents.message
                            }
                            register={register}
                            name='minimumNumberOfStudents'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterModalBody;
