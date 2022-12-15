import { Box, Typography } from "@mui/material";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { creditClassState } from "../../features/creditClassSlice";
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
    const [type, setType] = useState("");
    const [localExamsType, setLocalExamsType] = useState(examTypes);

    const { creditClasses } = useSelector(creditClassState);
    const { editedExam, errorObject } = useSelector(examState);
    const { tests, loading } = useSelector(testState);

    useEffect(() => {
        if (editedExam) {
            setValue("id", editedExam.id);
            setValue("creditClassId", editedExam.creditClassId);
            dispatch(fetchAllTests({ page: 0, subject: editedExam.subjectId, notUsedTest: true }));

            setValue("examDate", editedExam.examDate);
            setValue("noticePeriod", editedExam.noticePeriod);
            setValue("time", editedExam.time);
            setValue("numberOfStudents", editedExam.numberOfRegisters);
            setValue("type", editedExam.type);
        } else {
            setValue("id", "");
            setValue("creditClassId", "");
            setValue("examDate", "");
            setValue("noticePeriod", "");
            setValue("time", "");
            setValue("numberOfStudents", "");
            setValue("type", "");

            $(".tests-checkbox").each(function () {
                $(this).prop("checked", false);
            });
        }
    }, [editedExam]);

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
        if (creditClasses && creditClasses.length && !creditClassPage) {
            handleCreditClassChange({ target: { value: creditClasses[0].id } });
        }
    }, [creditClasses]);

    useEffect(() => {
        if (creditClassId && creditClassPage) {
            handleCreditClassChange({ target: { value: creditClassId } });
        }
    }, [creditClassId]);

    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);

        setValue("noticePeriod", noticePeriods[0].value);
        setValue("examType", examTypes[0].value);
        let date = tomorrow.getDate();
        if (parseInt(tomorrow.getDate()) < 10) {
            date = `0${tomorrow.getDate()}`;
        }

        setValue("examDate", `${date}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()}`);
    }, []);

    const handleCreditClassChange = ({ target: { value } }) => {
        if(creditClassPage) {
            return;
        }

        const creditClass = creditClasses.find(({ id }) => id.toString() === value.toString());

        setValue("creditClassId", value);
        $("#numberOfNoneCreatedMidtermExamStudents").val(
            creditClass.numberOfActiveStudents - creditClass.numberOfMidTermExamCreated
        );
        $("#numberOfNoneCreatedFinalTermExamStudents").val(
            creditClass.numberOfActiveStudents - creditClass.numberOfFinalTermExamCreated
        );
        $("#numberOfActiveStudents").val(creditClass.numberOfActiveStudents);

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

    return (
        <div>
            <div className='col-flex items-center justify-center w-full'>
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
                            !creditClassPage &&
                            creditClasses &&
                            creditClasses.length &&
                            creditClasses[0].id
                        }
                        onChangeHandler={handleCreditClassChange}
                        readOnly={(editedExam && editedExam.creditClassId) || creditClassPage}
                    />
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
                <>
                    <h3 className='text-black text-base uppercase mt-3'>Danh sách đề thi</h3>
                    <div className='w-full mt-5 border-2 rounded-sm overflow-y-auto max-h-52'>
                        <TestList rows={tests} />
                    </div>
                </>
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
                />
            </div>
        </div>
    );
}

export default ExamModalBody;
