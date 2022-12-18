import { Box, Typography } from "@mui/material";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { creditClassState, findCreditClass } from "../../features/creditClassSlice";
import { examState } from "../../features/examSlice";
import { fetchAllRegisters } from "../../features/registerSlice";
import { fetchAllTests, testState } from "../../features/testSlice";
import DatePicker from "../utils/datePicker/DatePicker";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";
import TestList from "./TestList";

export const examTypes = [
    {
        title: "Giữa kỳ",
        value: "Giữa kỳ",
    },
    {
        title: "Cuối kỳ",
        value: "Cuối kỳ",
    },
];

const noticePeriods = [
    {
        title: "1(7:00)",
        value: "1",
    },
    {
        title: "3(9:00)",
        value: "3",
    },
    {
        title: "5(13:00)",
        value: "5",
    },
    {
        title: "7(15:00)",
        value: "7",
    },
];

export function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function ExamModalBody({
    errors,
    register,
    dispatch,
    setValue,
    creditClassId,
    creditClassPage = false,
}) {
    const [localExamsType, setLocalExamsType] = useState(examTypes);
    const { creditClassesForExamAdded: creditClasses } = useSelector(creditClassState);
    const { editedExam, errorObject } = useSelector(examState);
    const { tests } = useSelector(testState);
    const { creditClass } = useSelector(creditClassState);

    useEffect(() => {
        console.log(editedExam);
        if (editedExam) {
            setValue("id", editedExam.id);
            setValue("examDate", editedExam.examDate);
            setValue("noticePeriod", editedExam.noticePeriod);
            setValue("time", editedExam.time);
            setValue("numberOfStudents", editedExam.numberOfRegisters);
            setValue("examType", editedExam.type);

            dispatch(findCreditClass({ id: editedExam.creditClassId }));
        } else {
            setValue("id", "");
            setValue("creditClassName", "");
            setValue("examDate", "");
            setValue("noticePeriod", "");
            setValue("time", "");
            setValue("numberOfStudents", "");
            setValue("examType", examTypes[0].value);

            configExamDate();

            $(".tests-checkbox").each(function () {
                $(this).prop("checked", false);
            });
        }
    }, [editedExam]);

    useEffect(() => {
        if (!editedExam && creditClasses && creditClasses.length) {
            handleCreditClassChange({ target: { value: creditClasses[0].id } });
        }
    }, [editedExam, creditClasses]);

    useEffect(() => {
        if (creditClass && editedExam) {
            const { schoolYear, semester, subjectName, group } = creditClass;
            setValue("creditClassId", creditClass.id);
            setValue("creditClassName", `${schoolYear} ${semester} ${subjectName} ${group}`);

            const numberOfNoneCreatedMidtermExamStudents =
                creditClass.numberOfActiveStudents - creditClass.numberOfMidTermExamCreated;
            const numberOfNoneCreatedFinalTermExamStudents =
                creditClass.numberOfActiveStudents - creditClass.numberOfFinalTermExamCreated;
            $("#numberOfNoneCreatedMidtermExamStudents").val(
                numberOfNoneCreatedMidtermExamStudents
            );
            $("#numberOfNoneCreatedFinalTermExamStudents").val(
                numberOfNoneCreatedFinalTermExamStudents
            );
            $("#numberOfActiveStudents").val(creditClass.numberOfActiveStudents);

            dispatch(
                fetchAllTests({
                    page: 0,
                    subject: creditClass.subjectId,
                    notUsedTest: true,
                    examId: editedExam.id,
                })
            );

            dispatch(
                fetchAllRegisters({
                    page: 0,
                    creditClass: creditClass.id,
                })
            );
        }
    }, [creditClass, editedExam]);

    useEffect(() => {
        if (tests && tests.length && editedExam) {
            $(".tests-checkbox").each(function () {
                if (editedExam.testIds.includes($(this).data("id"))) {
                    $(this).prop("checked", true);
                }
            });
        }
    }, [tests]);

    useEffect(() => {
        if (creditClasses && creditClasses.length && !creditClassPage && !editedExam) {
            handleCreditClassChange({ target: { value: creditClasses[0].id } });
        }
    }, [creditClasses]);

    useEffect(() => {
        if (creditClassId && creditClassPage) {
            handleCreditClassChange({ target: { value: creditClassId } });
        }
    }, [creditClassId]);

    function configExamDate() {
        const tomorrow = new Date();
        tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);

        setValue("noticePeriod", noticePeriods[0].value);
        setValue("examType", examTypes[0].value);
        let date = tomorrow.getDate();
        if (parseInt(tomorrow.getDate()) < 10) {
            date = `0${tomorrow.getDate()}`;
        }

        setValue("examDate", `${date}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()}`);
    }

    useEffect(() => {
        configExamDate();
    }, []);

    const handleCreditClassChange = ({ target: { value } }) => {
        const creditClass = creditClasses.find(({ id }) => id.toString() === value.toString());

        setValue("creditClassId", value);
        const numberOfNoneCreatedMidtermExamStudents =
            creditClass.numberOfActiveStudents - creditClass.numberOfMidTermExamCreated;
        const numberOfNoneCreatedFinalTermExamStudents =
            creditClass.numberOfActiveStudents - creditClass.numberOfFinalTermExamCreated;
        $("#numberOfNoneCreatedMidtermExamStudents").val(numberOfNoneCreatedMidtermExamStudents);
        $("#numberOfNoneCreatedFinalTermExamStudents").val(
            numberOfNoneCreatedFinalTermExamStudents
        );
        $("#numberOfActiveStudents").val(creditClass.numberOfActiveStudents);

        if (numberOfNoneCreatedMidtermExamStudents === 0) {
            setLocalExamsType(prevState => [
                ...prevState.filter(({ value }) => value !== "Giữa kỳ"),
            ]);
        }

        if (numberOfNoneCreatedFinalTermExamStudents === 0) {
            setLocalExamsType(prevState => [
                ...prevState.filter(({ value }) => value !== "Cuối kỳ"),
            ]);
        }
        dispatch(
            fetchAllTests({
                page: 0,
                subject: creditClass.subjectId,
                notUsedTest: true,
                activeTest: true,
            })
        );

        dispatch(
            fetchAllRegisters({
                page: 0,
                creditClass: $("#creditClassId").val(),
            })
        );
    };
    console.log(errors);
    return (
        <div>
            <div>
                <div className='col-flex items-center justify-center w-full'>
                    <div className='w-full'>
                        {!editedExam ? (
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
                                    !creditClassPage &&
                                    creditClasses &&
                                    creditClasses.length &&
                                    creditClasses[0].id
                                }
                                onChangeHandler={handleCreditClassChange}
                                readOnly={
                                    (editedExam && editedExam.creditClassId) || creditClassPage
                                }
                            />
                        ) : (
                            <Input readOnly={true} register={register} name='creditClassName' />
                        )}
                    </div>
                </div>
                <div
                    className={`flex w-full mt-5 ${
                        errors.numberOfActiveStudents ? "items-start" : "items-end"
                    }`}
                >
                    <div className='w-full mr-5'>
                        <Input
                            label={`Số  SV chưa được tạo ca thi giữa kỳ`}
                            register={register}
                            name='numberOfNoneCreatedMidtermExamStudents'
                            error={
                                errors.numberOfNoneCreatedMidTermExamStudents &&
                                errors.numberOfNoneCreatedMidTermExamStudents.message
                            }
                            readOnly
                        />
                    </div>
                    <div className='w-full mr-5'>
                        <Input
                            label={`Số  SV chưa được tạo ca thi cuối kỳ`}
                            register={register}
                            name='numberOfNoneCreatedFinalTermExamStudents'
                            error={
                                errors.numberOfNoneCreatedFinalTermExamStudents &&
                                errors.numberOfNoneCreatedFinalTermExamStudents.message
                            }
                            readOnly
                        />
                    </div>
                    <div className='w-full'>
                        <Input
                            label={`Tổng số sinh viên`}
                            register={register}
                            name='numberOfActiveStudents'
                            readOnly
                        />
                    </div>
                </div>
                {tests.length > 0 ? (
                    <div>
                        <div className='text-black text-base uppercase mt-3 text-center font-semibold text-blue-500'>
                            Danh sách đề thi
                        </div>
                        <div className='w-full mt-5 border-2 rounded-sm overflow-y-auto max-h-52'>
                            <TestList rows={tests} addCheckbox />
                        </div>
                    </div>
                ) : (
                    <div className='uppercase my-3 text-red-600 w-full text-center'>
                        Môn học của lớp tín chỉ này chưa có đề thi
                    </div>
                )}
                <div
                    className={`flex w-full mt-5 ${
                        errors.examDate || errors.noticePeriod ? "items-start" : "items-center"
                    }`}
                >
                    <div className='mr-5 w-full'>
                        <DatePicker
                            register={register}
                            name='examDate'
                            error={errors.examDate && errors.examDate.message}
                            label='Ngày thi *'
                        />
                    </div>
                    <div className='w-full'>
                        <Select
                            label='Tiết báo danh *'
                            register={register}
                            name='noticePeriod'
                            options={noticePeriods}
                            // error={errors.creditClassId && errors.creditClassId.message}
                            setValue={setValue}
                            defaultValue={noticePeriods[0].value}
                        />
                    </div>
                </div>
                <div
                    className={`flex w-full mt-5 ${
                        errors.time || errors.numberOfStudents ? "items-start" : "items-center"
                    }`}
                >
                    <div className='w-full mr-5'>
                        <div className='w-full'>
                            <Input
                                label='Thời gian làm bài (phút) *'
                                error={errors.time && errors.time.message}
                                register={register}
                                name='time'
                                type='number'
                            />
                        </div>
                    </div>{" "}
                    <div className='w-full'>
                        <Input
                            label='Số  sinh viên thi *'
                            error={errors.numberOfStudents && errors.numberOfStudents.message}
                            register={register}
                            name='numberOfStudents'
                            readOnly={editedExam && editedExam.numberOfRegisters}
                            type='number'
                        />
                    </div>
                </div>
                <div className='w-full mt-5'>
                    <Select
                        label='Loại kỳ thi *'
                        register={register}
                        name='examType'
                        options={localExamsType.map(({ title, value }) => ({
                            title,
                            value,
                        }))}
                        setValue={setValue}
                        defaultValue={examTypes[0].value}
                        readOnly={editedExam && editedExam.type}
                        error={errors.examType && errors.examType.message}
                    />
                </div>
            </div>
        </div>
    );
}

export default ExamModalBody;
