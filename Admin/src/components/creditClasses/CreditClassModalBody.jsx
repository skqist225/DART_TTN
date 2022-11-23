import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { creditClassState } from "../../features/creditClassSlice";
import { subjectState } from "../../features/subjectSlice";
import { userState } from "../../features/userSlice";
import { callToast } from "../../helpers";
import Select from "../utils/userInputs/Select";

const schoolYears = [
    {
        title: "2022-2023",
        value: "2022-2023",
    },
    {
        title: "2023-2024",
        value: "2023-2024",
    },
    {
        title: "2024-2025",
        value: "2024-2025",
    },
];

const semesters = Array.from({ length: 4 }).map((_, index) => ({
    title: index + 1,
    value: index + 1,
}));

const groups = Array.from({ length: 10 }).map((_, index) => ({
    title: index + 1,
    value: index + 1,
}));

function CreditClassModalBody({ errors, register, dispatch, setValue }) {
    const { editedCreditClass, errorObject } = useSelector(creditClassState);
    const { subjects } = useSelector(subjectState);
    const { users } = useSelector(userState);

    useEffect(() => {
        if (editedCreditClass) {
            setValue("id", editedCreditClass.id);
            setValue("schoolYear", editedCreditClass.schoolYear);
            setValue("semester", editedCreditClass.semester);
            setValue("subjectId", editedCreditClass.subjectId);
            setValue("group", editedCreditClass.group);
            setValue("teacherId", editedCreditClass.teacherId);
        } else {
            setValue("id", "");
            setValue("schoolYear", schoolYears[0].value);
            setValue("semester", semesters[0].value);
            setValue("subjectId", "");
            setValue("group", groups[0].value);
            setValue("teacherId", "");
        }
    }, [editedCreditClass]);

    useEffect(() => {}, []);

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
                <div
                    className={`flex w-full mt-5 ${
                        errors.schoolYear || errors.semester ? "items-start" : "items-center"
                    }`}
                >
                    <div className='mr-5 w-full'>
                        <Select
                            label='Niên khóa *'
                            register={register}
                            name='schoolYear'
                            options={schoolYears}
                            error={errors.schoolYear && errors.schoolYear.message}
                            setValue={setValue}
                            onChangeHandler={handleTypeChange}
                            defaultValue={schoolYears && schoolYears.length && schoolYears[0].value}
                        />
                    </div>
                    <div className='w-full'>
                        <Select
                            label='Học kỳ *'
                            register={register}
                            name='semester'
                            options={semesters}
                            error={errors.semester && errors.semester.message}
                            setValue={setValue}
                            defaultValue={semesters && semesters.length && semesters[0].value}
                        />
                    </div>
                </div>
                <div
                    className={`flex w-full mt-5 ${
                        errors.subjectId || errors.group ? "items-start" : "items-center"
                    }`}
                >
                    <div className='mr-5 w-full'>
                        <Select
                            label='Môn học *'
                            register={register}
                            name='subjectId'
                            options={subjects.map(subject => ({
                                title: subject.name,
                                value: subject.id,
                            }))}
                            error={errors.subjectId && errors.subjectId.message}
                            setValue={setValue}
                            defaultValue={subjects && subjects.length && subjects[0].id}
                        />
                    </div>
                    <div className='w-full'>
                        <Select
                            label='Nhóm *'
                            register={register}
                            name='group'
                            options={groups}
                            error={errors.group && errors.group.message}
                            setValue={setValue}
                            defaultValue={groups && groups.length && groups[0].value}
                        />
                    </div>
                </div>
                <div className='w-full my-5 flex items-center'>
                    <div className='w-full'>
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
                </div>
            </div>
        </div>
    );
}

export default CreditClassModalBody;
