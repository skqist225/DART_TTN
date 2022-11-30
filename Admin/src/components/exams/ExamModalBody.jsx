import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { creditClassState } from "../../features/creditClassSlice";
import { examState, setEditedExam } from "../../features/examSlice";
import { fetchAllTests, testState } from "../../features/testSlice";
import TestTableBody from "../tests/TestTableBody";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";
import DatePicker from "../utils/datePicker/DatePicker";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { fetchAllRegisters, registerState } from "../../features/registerSlice";
import $ from "jquery";
import RegisterTableBody from "../registers/RegisterTableBody";
import TablePagination from "../utils/tables/TablePagination";
import TableHeader from "../utils/tables/TableHeader";

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

const columns = [
    {
        name: "Mã SV",
        sortField: "fullName",
        sortable: true,
    },
    {
        name: "Họ tên",
        sortField: "creditClass",
        sortable: true,
    },
];

function TabPanel(props) {
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

function a11yProps(index) {
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
    const [skipUpdateCreditClass, setSkipUpdateCreditClass] = useState(false);
    const [numberOfActiveStudents, setNumberOfActiveStudents] = useState(0);

    const { creditClasses } = useSelector(creditClassState);
    const { editedExam, errorObject } = useSelector(examState);
    const { tests } = useSelector(testState);
    const { registers, totalElements, totalPages } = useSelector(registerState);

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
            dispatch(
                fetchAllTests({ page: 0, subject: creditClasses[0].subjectId, notUsedTest: true })
            );
        }
    }, [creditClasses]);

    useEffect(() => {
        if (creditClassId && creditClassPage) {
            handleCreditClassChange({ target: { value: creditClassId } });
        }
    }, [creditClassId]);

    useEffect(() => {
        const date = new Date();

        setValue("noticePeriod", noticePeriods[0].value);
        setValue("type", examTypes[0].value);
        setValue("examDate", `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
    }, []);

    const handleCreditClassChange = ({ target: { value } }) => {
        const creditClass = creditClasses.find(({ id }) => id.toString() === value.toString());
        dispatch(fetchAllTests({ page: 0, subject: creditClass.subjectId, notUsedTest: true }));
        setNumberOfActiveStudents(creditClass.numberOfActiveStudents);

        setValue(
            "numberOfNoneCreatedMidtermExamStudents",
            `${creditClass.numberOfActiveStudents - creditClass.numberOfMidTermExamCreated} / ${
                creditClass.numberOfActiveStudents
            } sinh viên`
        );
        setValue(
            "numberOfNoneCreatedFinalTermExamStudents",
            `${creditClass.numberOfActiveStudents - creditClass.numberOfFinalTermExamCreated} / ${
                creditClass.numberOfActiveStudents
            } sinh viên`
        );
    };

    const [tabValue, setTabValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 1) {
            dispatch(
                fetchAllRegisters({
                    page: 0,
                    creditClass: $("#creditClassId").val(),
                })
            );

            setType($("#type").val());
            setSkipUpdateCreditClass(true);
        }
    };

    return (
        <div>
            <Tabs value={tabValue} onChange={handleChange} centered>
                <Tab label='Thông tin ca thi' {...a11yProps(0)} />
                <Tab label='Danh sách sinh viên' {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                <div className='col-flex items-center justify-center w-full'>
                    <div
                        className={`flex w-full mt-5 ${
                            errors.creditClassId ||
                            errors.numberOfActiveStudents ||
                            errors.numberOfActiveStudents
                                ? "items-start"
                                : "items-center"
                        }`}
                    >
                        <div className='w-full mr-5'>
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
                                    !skipUpdateCreditClass &&
                                    !creditClassPage &&
                                    creditClasses &&
                                    creditClasses.length &&
                                    creditClasses[0].id
                                }
                                onChangeHandler={!creditClassPage && handleCreditClassChange}
                                readOnly={
                                    (editedExam && editedExam.creditClassId) || creditClassPage
                                }
                            />
                        </div>
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
                        <div className='w-full'>
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
                    </div>
                    <h3 className='text-black text-base uppercase mt-3'>Danh sách đề thi</h3>
                    <div className='w-full mt-5 border-2 rounded-sm overflow-y-auto max-h-52'>
                        <TestTableBody rows={tests} examPage />
                    </div>
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
                            name='type'
                            options={examTypes.map(({ title, value }) => ({
                                title,
                                value,
                            }))}
                            // error={errors.testId && errors.testId.message}
                            setValue={setValue}
                            defaultValue={examTypes[0].value}
                            readOnly={editedExam && editedExam.type}
                        />
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {registers && registers.length && (
                    <>
                        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                            {/* handleSortChange={handleSortChange} */}
                            <TableHeader columns={columns} addCheckbox />
                            <RegisterTableBody rows={registers} type={type} addExam />
                        </table>
                        <TablePagination
                            totalElements={totalElements}
                            totalPages={totalPages}
                            // fetchDataByPageNumber={fetchDataByPageNumber}
                        />
                    </>
                )}
            </TabPanel>
        </div>
    );
}

export default ExamModalBody;
