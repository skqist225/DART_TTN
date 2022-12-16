import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFieldArray } from "react-hook-form";
import { chapterState, fetchAllChapters } from "../../features/chapterSlice";
import {
    fetchAllQuestions,
    loadQuestionsByCriteria,
    queryAvailableQuestions,
    questionState,
    setQuestions,
} from "../../features/questionSlice";
import { subjectState } from "../../features/subjectSlice";
import TableHeader from "../utils/tables/TableHeader";
import TablePagination from "../utils/tables/TablePagination";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";
import { QuestionTableBody } from "..";
import { tailwindCss } from "../../tailwind";
import { setAddTestDisabled, testState } from "../../features/testSlice";
import $ from "jquery";
import { questionColumnsTestPage } from "../../pages/columns";
import Datepicker from "../../partials/actions/Datepicker";
import { Tab, Tabs } from "@mui/material";
import { a11yProps, TabPanel } from "../exams/ExamModalBody";

const levelOptions = [
    {
        value: "",
        title: "Chọn mức độ",
    },
    {
        value: "EASY",
        title: "Dễ",
    },
    {
        value: "MEDIUM",
        title: "Trung bình",
    },
    {
        value: "HARD",
        title: "Khó",
    },
];

function TestModalBody({ errors, register, setValue, control, getValues, clearErrors }) {
    const dispatch = useDispatch();

    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState("");
    const [page, setPage] = useState(1);
    const [page2, setPage2] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [allQuestions, setAllQuestions] = useState([]);
    const [disableCurrentQuestionInput, setDisableCurrentQuestionInput] = useState(false);

    const { editedTest, errorObject, addTestDisabled } = useSelector(testState);
    const { subjects } = useSelector(subjectState);
    const { chapters } = useSelector(chapterState);
    const { questions, totalPages, totalElements, queryAvailableQuestionsArr } =
        useSelector(questionState);

    useEffect(() => {
        console.log("editedTest: ", editedTest);
        if (editedTest) {
            setValue("id", editedTest.id);
            setValue("name", editedTest.name);
            dispatch(fetchAllQuestions({ page: 0, subject: editedTest.subjectId }));
        } else {
            setValue("id", "");
            setValue("name", "");
        }
    }, [editedTest]);

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "criteria",
    });

    const {
        fields: fds,
        prepend: prd,
        remove: rm,
    } = useFieldArray({
        control,
        name: "editedQuestions",
    });

    const {
        fields: fds2,
        prepend: prd2,
        remove: rm2,
    } = useFieldArray({
        control,
        name: "etdQsts",
    });

    useEffect(() => {
        if (questions && questions.length) {
            fetchDataByPageNumber2(1);
        }
    }, [questions]);

    useEffect(() => {
        if (subjects && subjects.length) {
            dispatch(fetchAllChapters({ page: 0, subject: subjects[0].id }));
            setValue("testName", `Đề thi ${subjects[0].name} ${new Date().getTime()}`);
            setSelectedSubject(subjects[0]);
            if (!subjects[0].chapters.length) {
                dispatch(setAddTestDisabled(true));
            } else {
                dispatch(setAddTestDisabled(false));
            }
        }
    }, [subjects]);

    useEffect(() => {
        setValue("totalSelected", 0);
    }, []);

    function onSubjectChange({ target: { value } }) {
        dispatch(fetchAllChapters({ page: 0, subject: value }));
        setValue(
            "testName",
            `Đề thi ${subjects.find(({ id }) => id === value).name} ${new Date().getTime()}`
        );

        const subject = subjects.find(({ id }) => id.toString() === $("#testSubjectId").val());
        setSelectedSubject(subject);

        if (!subject.chapters.length) {
            dispatch(setAddTestDisabled(true));
        } else {
            dispatch(setAddTestDisabled(false));
        }
    }

    function onChapterChange(event, fieldId) {
        const index = $(event.target).data("index");
        const criteria = getValues("criteria");
        const chapter = $(event.target).val();
        const level = criteria[index].level;

        if (level) {
            dispatch(queryAvailableQuestions({ chapter, level, filterIndex: fieldId }));
        }
    }

    function onLevelChange(event, fieldId) {
        const index = $(event.target).data("index");
        const criteria = getValues("criteria");
        const chapter = criteria[index].chapterId;
        const level = $(event.target).val();

        if (chapter) {
            dispatch(queryAvailableQuestions({ chapter, level, filterIndex: fieldId }));
        }
    }

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const recordsPerPage = 10;
    const fetchDataByPageNumber = pageNumber => {
        setPage(pageNumber);
    };

    const recordsPerPage2 = 10;
    const fetchDataByPageNumber2 = pageNumber => {
        if (editedTest) {
            setAllQuestions(
                questions
                    .filter(({ id }) => !editedTest.questions.map(({ id }) => id).includes(id))
                    .slice(
                        (page2 - 1) * recordsPerPage2,
                        (page2 - 1) * recordsPerPage2 + recordsPerPage2
                    )
            );
            setPage2(pageNumber);
        }
    };

    const handleCurrentQuestionInputChange = ({ target: { value } }) => {
        if (parseInt(value) > 0) setValue("totalSelected", value);
    };

    const handleFilterChange = () => {
        const criteria = getValues("criteria");
        const totalSelectedQuestion = criteria.reduce(
            (acc, { numberOfQuestions }) => acc + parseInt(numberOfQuestions) || 0,
            0
        );

        setValue("totalSelected", parseInt(totalSelectedQuestion));
    };

    console.log(errors);

    return (
        <div>
            {!editedTest ? (
                <div className='col-flex items-center justify-center w-full'>
                    <div
                        className={`flex w-full mb-4 ${
                            errors.testName || errors.testSubjectId ? "items-start" : "items-center"
                        }`}
                    >
                        <div className='w-full mr-5'>
                            <Input
                                label='Tên đề thi *'
                                error={errors.testName && errors.testName.message}
                                register={register}
                                name='testName'
                            />
                        </div>
                        <div className='w-full'>
                            <Select
                                label='Môn học *'
                                error={errors.testSubjectId && errors.testSubjectId.message}
                                register={register}
                                name='testSubjectId'
                                options={subjects.map(s => ({
                                    title: `${s.name} ${s.id.includes("CLC") ? "CLC" : ""}`,
                                    value: s.id,
                                }))}
                                setValue={setValue}
                                onChangeHandler={onSubjectChange}
                                defaultValue={subjects && subjects[0] && subjects[0].id}
                            />
                        </div>
                    </div>
                    <div
                        className={`flex w-full my-4 ${
                            errors.numberOfQuestions || errors.testSubjectId
                                ? "items-start"
                                : "items-center"
                        }`}
                    >
                        <div className='w-full mr-5'>
                            <Input
                                label={`Số lượng (Hiện có: ${
                                    selectedSubject && selectedSubject.numberOfActiveQuestions
                                })`}
                                error={errors.numberOfQuestions && errors.numberOfQuestions.message}
                                register={register}
                                name='numberOfQuestions'
                                readOnly={addTestDisabled || disableCurrentQuestionInput}
                                placeholder='Nếu không chọn tiêu chí tui lòng điền số câu hỏi'
                                onChangeHandler={handleCurrentQuestionInputChange}
                                type='number'
                            />
                        </div>
                        <div className='w-full'>
                            <Input
                                label='Số câu hỏi đã chọn'
                                register={register}
                                name='totalSelected'
                                readOnly={true}
                            />
                        </div>
                    </div>
                    <ul className='w-full'>
                        <div className='uppercase flex items-center w-full justify-center text-blue-600 font-semibold'>
                            Tiêu chí chọn đề thi ({fields.length})
                        </div>
                        {fields.map((field, index) => (
                            <li
                                className={`mt-3 flex items-end ${
                                    errors &&
                                    errors.criteria &&
                                    errors.criteria.length &&
                                    errors.criteria[index]
                                        ? "items-center"
                                        : "items-end"
                                }`}
                                key={index}
                            >
                                <div
                                    className={`flex ${
                                        errors && errors.criteria && errors.criteria.length
                                            ? "items-start"
                                            : "items-end"
                                    } w-full`}
                                >
                                    <div className='w-full mr-3'>
                                        <Select
                                            label='Chương'
                                            register={register}
                                            name={`criteria.${index}.chapterId`}
                                            error={
                                                errors.criteria &&
                                                errors.criteria[`${index}`] &&
                                                errors.criteria[`${index}`].chapterId &&
                                                errors.criteria[`${index}`].chapterId.message
                                            }
                                            options={chapters.map(s => ({
                                                title: s.name + ` (${s.numberOfActiveQuestions})`,
                                                value: s.id,
                                            }))}
                                            index={index}
                                            setValue={setValue}
                                            defaultValue={chapters && chapters[0] && chapters[0].id}
                                            onChangeHandler={e => {
                                                onChapterChange(e, field.id);
                                            }}
                                        />
                                    </div>
                                    <div className='w-full mr-3'>
                                        <Select
                                            label='Độ khó'
                                            register={register}
                                            error={
                                                errors.criteria &&
                                                errors.criteria[`${index}`] &&
                                                errors.criteria[`${index}`].level &&
                                                errors.criteria[`${index}`].level.message
                                            }
                                            name={`criteria.${index}.level`}
                                            index={index}
                                            options={levelOptions}
                                            required
                                            onChangeHandler={e => {
                                                onLevelChange(e, field.id);
                                            }}
                                        />
                                    </div>
                                    <div className='w-full mr-3'>
                                        <Input
                                            label={`Số lượng (Hiện có: ${
                                                (queryAvailableQuestionsArr &&
                                                    queryAvailableQuestionsArr[field.id] &&
                                                    queryAvailableQuestionsArr[field.id]) ||
                                                0
                                            })`}
                                            register={register}
                                            error={
                                                errors.criteria &&
                                                errors.criteria[`${index}`] &&
                                                errors.criteria[`${index}`].numberOfQuestions &&
                                                errors.criteria[`${index}`].numberOfQuestions
                                                    .message
                                            }
                                            name={`criteria.${index}.numberOfQuestions`}
                                            required
                                            type='number'
                                            onChangeHandler={handleFilterChange}
                                        />
                                    </div>
                                    <input
                                        type='hidden'
                                        {...register(`criteria.${index}.fieldIndex`)}
                                        value={field.id}
                                    />
                                </div>
                                <div>
                                    <button
                                        type='button'
                                        className={tailwindCss.deleteOutlineButton}
                                        onClick={() => {
                                            remove(index);
                                            if (index === 0) {
                                                dispatch(setQuestions([]));
                                                setValue("numberOfQuestions", selectedNumber);
                                                setDisableCurrentQuestionInput(false);
                                            } else {
                                                const criteria = getValues("criteria");
                                                dispatch(
                                                    loadQuestionsByCriteria({
                                                        subject: $("#testSubjectId").val(),
                                                        criteria,
                                                    })
                                                );
                                            }
                                            handleFilterChange();
                                        }}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className='mt-3 self-start'>
                        <button
                            type='button'
                            className={`${tailwindCss.greenOutlineButton} ${
                                addTestDisabled &&
                                "cursor-not-allowed hover:text-green-700 hover:bg-white"
                            }`}
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();

                                if (fields.length === 0) {
                                    setSelectedNumber($("#numberOfQuestions").val());
                                    setValue("numberOfQuestions", "");
                                }
                                prepend({
                                    chapterId: chapters[0].id,
                                    level: levelOptions[0].value,
                                    numberOfQuestions: 0,
                                });
                                setDisableCurrentQuestionInput(true);
                                clearErrors("numberOfQuestions");
                            }}
                            disabled={addTestDisabled}
                        >
                            Thêm tiêu chí {fields.length + 1}
                        </button>
                    </div>
                    {questions && questions.length > 0 && (
                        <div className='w-full'>
                            <div className='uppercase text-center font-semibold text-green-700 w-full'>
                                Danh sách câu hỏi
                            </div>
                            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                <TableHeader columns={questionColumnsTestPage} />
                                <QuestionTableBody
                                    rows={questions}
                                    pageNumber={page}
                                    addTest
                                    dispatch={dispatch}
                                />
                            </table>
                            <TablePagination
                                totalElements={totalElements}
                                totalPages={totalPages}
                                setPage={setPage}
                                recordsPerPage={recordsPerPage}
                                fetchDataByPageNumber={fetchDataByPageNumber}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className='col-flex items-center justify-center w-full'>
                    <div className='w-full my-5 mr-5'>
                        <Input
                            label='Tên đề thi *'
                            error={errors.testName && errors.testName.message}
                            register={register}
                            name='testName'
                        />
                    </div>
                    <Tabs value={tabValue} onChange={handleChange} centered>
                        <Tab label='Câu hỏi hiện có' {...a11yProps(0)} />
                        <Tab label='Danh sách câu hỏi' {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <div>
                            {editedTest.questions && editedTest.questions.length > 0 && (
                                <div className='w-full'>
                                    <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                        <TableHeader
                                            columns={questionColumnsTestPage}
                                            addCheckbox
                                        />
                                        <QuestionTableBody
                                            rows={editedTest.questions}
                                            page={page}
                                            addTest
                                            dispatch={dispatch}
                                            register={register}
                                            addCheckbox
                                            check={true}
                                        />
                                    </table>
                                    <TablePagination
                                        totalElements={editedTest.questions.length}
                                        totalPages={Math.ceil(editedTest.questions.length / 10)}
                                        setPage={setPage}
                                    />
                                </div>
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        {allQuestions && allQuestions.length > 0 && (
                            <div>
                                <div className='uppercase'>Danh sách câu hỏi</div>
                                <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                    <TableHeader columns={questionColumnsTestPage} addCheckbox />
                                    <QuestionTableBody
                                        rows={allQuestions}
                                        page={page}
                                        addTest
                                        dispatch={dispatch}
                                        register={register}
                                        addCheckbox
                                        check={false}
                                    />
                                </table>
                                <TablePagination
                                    totalElements={questions.length - editedTest.questions.length}
                                    totalPages={Math.ceil(
                                        (questions.length - editedTest.questions.length) /
                                            recordsPerPage2
                                    )}
                                    setPage={setPage2}
                                    fetchDataByPageNumber={fetchDataByPageNumber2}
                                />
                            </div>
                        )}
                    </TabPanel>
                </div>
            )}
        </div>
    );
}

export default TestModalBody;
