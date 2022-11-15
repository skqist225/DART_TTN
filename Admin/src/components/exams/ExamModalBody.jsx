import { Checkbox, Label } from "flowbite-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { clearErrorField, creditClassState } from "../../features/creditClassSlice";
import { setEditedExam } from "../../features/examSlice";
import { fetchAllTests, testState } from "../../features/testSlice";
import TestTableBody from "../tests/TestTableBody";
import DatePicker from "../utils/datePicker/DatePicker";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";

const examTypes = [
    {
        title: "Giữa kỳ",
        value: "Giữa kỳ",
    },
    {
        title: "Cuối kỳ",
        value: "Cuối kỳ",
    },
];

function ExamModalBody({ errors, register, dispatch, setValue }) {
    const { editedCreditClass, errorObject, creditClasses } = useSelector(creditClassState);
    const { tests } = useSelector(testState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
    };

    useEffect(() => {
        if (setEditedExam) {
            // setValue("id", editedCreditClass.id);
            // setValue("name", editedCreditClass.name);
        } else {
            // setValue("id", editedCreditClass.id);
            // setValue("name", editedCreditClass.name);
        }
    }, [editedCreditClass]);

    console.log(creditClasses);

    const handleCreditClassChanged = ({ target: { value } }) => {
        const creditClass = creditClasses.find(({ id }) => id.toString() === value.toString());
        dispatch(fetchAllTests({ page: 0, subjectId: creditClass.subjectId }));
    };

    return (
        <div>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full flex items-center'>
                    <div className='w-full'>
                        <Select
                            label='Lớp tín chỉ *'
                            register={register}
                            name='creditClassId'
                            options={creditClasses.map(
                                ({ id, schoolYear, semester, subjectName, group }) => ({
                                    title: `${schoolYear} ${semester} ${subjectName} ${group}`,
                                    value: id,
                                })
                            )}
                            error={errors.creditClassId && errors.creditClassId.message}
                            setValue={setValue}
                            defaultValue={
                                creditClasses && creditClasses.length && creditClasses[0].id
                            }
                            onChangeHandler={handleCreditClassChanged}
                        />
                    </div>
                </div>
                <div className='w-full mt-5 border-2 rounded-sm'>
                    <TestTableBody rows={tests} examPage />
                </div>
                <div className='w-full mt-5 flex items-center'>
                    <div className='mr-5 w-full'>
                        <DatePicker
                            register={register}
                            name='examDate'
                            error
                            label={"Ngày thi *"}
                        />
                    </div>
                    <div className='w-full'>
                        <Input
                            label='Thời gian làm bài *'
                            error={errors.time && errors.time.message}
                            register={register}
                            name='time'
                            onKeyDown={onKeyDown}
                        />
                    </div>
                </div>
                <div className='flex items-center'>
                    <div className='w-full mt-5'>
                        <Select
                            label='Loại kỳ thi *'
                            register={register}
                            name='type'
                            options={examTypes.map(({ title, value }) => ({
                                title,
                                value,
                            }))}
                            // error={errors.testId && errors.testId.message}
                            setValue={setValue}
                            defaultValue={examTypes && examTypes.length && examTypes[0].id}
                        />
                    </div>
                    <div className='w-full mt-5'>
                        <Select
                            label='Loại kỳ thi *'
                            register={register}
                            name='type'
                            options={examTypes.map(({ title, value }) => ({
                                title,
                                value,
                            }))}
                            // error={errors.testId && errors.testId.message}
                            setValue={setValue}
                            defaultValue={examTypes && examTypes.length && examTypes[0].id}
                        />
                    </div>
                </div>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-2'>
                        <Checkbox id='accept' defaultChecked={true} />
                        <Label htmlFor='accept'>
                            I agree to the{" "}
                            <a
                                href='/forms'
                                className='text-blue-600 hover:underline dark:text-blue-500'
                            >
                                terms and conditions
                            </a>
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExamModalBody;
