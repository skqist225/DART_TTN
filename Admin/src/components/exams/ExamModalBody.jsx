import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { clearErrorField, creditClassState } from "../../features/creditClassSlice";
import { setEditedExam } from "../../features/examSlice";
import { fetchAllTests, testState } from "../../features/testSlice";
import TestTableBody from "../tests/TestTableBody";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";
import DatePicker from "../utils/datePicker/DatePicker";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { fetchAllRegisters } from "../../features/registerSlice";
import $ from "jquery";

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


    useEffect(() => {
        if (creditClasses && creditClasses.length) {
            dispatch(fetchAllTests({ page: 0, subject: creditClasses[0].subjectId }));
            setValue("numberOfActiveStudents", creditClasses[0].numberOfActiveStudents);
        }
    }, [creditClasses]);

    const handleCreditClassChanged = ({ target: { value } }) => {
        const creditClass = creditClasses.find(({ id }) => id.toString() === value.toString());
        dispatch(fetchAllTests({ page: 0, subject: creditClass.subjectId }));
        setValue("numberOfActiveStudents", creditClass.numberOfActiveStudents);
    };
    const [tabValue, setTabValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 1) {
            console.log($("#creditClassId").val());
            console.log($("#type").val());
            dispatch(fetchAllRegisters({page:0,creditClassId:}));
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
                    <div className='w-full flex items-center'>
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
                                    creditClasses && creditClasses.length && creditClasses[0].id
                                }
                                onChangeHandler={handleCreditClassChanged}
                            />
                        </div>
                        <div className='w-full'>
                            <Input
                                label='Số  SV đang học*'
                                register={register}
                                name='numberOfActiveStudents'
                                error={
                                    errors.numberOfActiveStudents &&
                                    errors.numberOfActiveStudents.message
                                }
                                readOnly
                            />
                        </div>
                    </div>
                    <div className='w-full mt-5 border-2 rounded-sm'>
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
                                defaultValue={
                                    noticePeriods && noticePeriods.length && noticePeriods[0].value
                                }
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
                                    label='Thời gian làm bài(phút) *'
                                    error={errors.time && errors.time.message}
                                    register={register}
                                    name='time'
                                    onKeyDown={onKeyDown}
                                />
                            </div>
                        </div>{" "}
                        <div className='w-full'>
                            <Input
                                label='Số  SV thi*'
                                error={errors.numberOfStudents && errors.numberOfStudents.message}
                                register={register}
                                name='numberOfStudents'
                                onKeyDown={onKeyDown}
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
                            defaultValue={examTypes && examTypes.length && examTypes[0].id}
                        />
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1} style={{ paddingX: "0" }}>
                Item One
            </TabPanel>
        </div>
    );
}

export default ExamModalBody;
