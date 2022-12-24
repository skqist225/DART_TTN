import { Collapse, FormControlLabel, Switch } from "@mui/material";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { chapterState, fetchAllChapters } from "../../features/chapterSlice";
import {
    loadQuestionsByCriteria,
    queryAvailableQuestions,
    questionState,
    setQuestions,
} from "../../features/questionSlice";
import { subjectState } from "../../features/subjectSlice";
import { setAddTestDisabled, testState } from "../../features/testSlice";
import Help from "../../partials/header/Help";
import { tailwindCss } from "../../tailwind";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";

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
    const [disableCurrentQuestionInput, setDisableCurrentQuestionInput] = useState(false);
    const [levelOptionsLocal, setLevelOptionsLocal] = useState([]);
    const [selectedCriteria, setSelectedCriteria] = useState(null);

    const { editedTest, addTestDisabled, userTests } = useSelector(testState);
    const { subjectsHaveQuestion: subjects } = useSelector(subjectState);
    const { chapters } = useSelector(chapterState);
    const { questions, queryAvailableQuestionsArr } = useSelector(questionState);

    function lookupLevel(level) {
        if (level === "Dễ") {
            return "EASY";
        } else if (level === "Trung bình") {
            return "MEDIUM";
        } else {
            return "HARD";
        }
    }

    useEffect(() => {
        console.log("editedTest: ", editedTest);
        if (editedTest) {
            setValue("testId", editedTest.id);
            setValue("testName", editedTest.name);
            editedTest.criteria.forEach(({ chapter, levelAndNumbers }) => {
                levelAndNumbers.forEach(({ level, numberOfQuestions, chapterId }) => {
                    editPrepend({ chapterId, level: lookupLevel(level), numberOfQuestions });
                });
            });
            let totalActiveQuestionsOfSubject = 0;
            const tempLevelOptionsLocal = [];
            editedTest.subjectChapters.forEach(
                ({
                    tempQuestions,
                    numberOfEasyQuestions,
                    numberOfMediumQuestions,
                    numberOfHardQuestions,
                    name,
                }) => {
                    totalActiveQuestionsOfSubject += parseInt(tempQuestions.length);
                    tempLevelOptionsLocal.push({
                        chapterName: name,
                        levelAndItsNumber: [
                            `Dễ (${numberOfEasyQuestions || 0})`,
                            `Trung bình (${numberOfMediumQuestions || 0})`,
                            `Khó (${numberOfHardQuestions || 0})`,
                        ],
                    });
                }
            );
            setLevelOptionsLocal(tempLevelOptionsLocal);

            $("#loadQuestionTestPageButton").trigger("click");
            setValue("testSubjectId", editedTest.subjectId);
            setValue("testSubjectName", editedTest.subjectName);
            setValue("totalSelected", editedTest.numberOfQuestions);
            setValue("totalActiveQuestions", totalActiveQuestionsOfSubject);
        } else {
            setValue("testId", "");
            setValue("totalSelected", 0);
            setValue("totalActiveQuestions", "");
        }
    }, [editedTest]);

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "criteria",
    });

    const {
        fields: editFields,
        prepend: editPrepend,
        remove: editRemove,
    } = useFieldArray({
        control,
        name: "criteria2",
    });

    useEffect(() => {
        if (editFields && editFields.length) {
            editFields.forEach(data => {
                const { chapterId, id, level } = data;
                dispatch(queryAvailableQuestions({ chapter: chapterId, level, filterIndex: id }));
            });
        }
    }, [editFields]);

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
        setValue("testSubjectId", value);
        const subject = subjects.find(({ id }) => id.toString() === $("#testSubjectId").val());
        setSelectedSubject(subject);

        if (!subject.chapters.length) {
            dispatch(setAddTestDisabled(true));
        } else {
            dispatch(setAddTestDisabled(false));
        }
    }

    function onCriteriaChange({ target: { value } }) {
        setValue("criteria", []);
        const selectedCriteria = userTests.filter(({ testId }) => testId === parseInt(value))[0];
        console.log(selectedCriteria);
        onSubjectChange({ target: { value: selectedCriteria.subjectId } });
        setSelectedCriteria(selectedCriteria);
    }

    useEffect(() => {
        if (chapters && chapters.length > 0 && selectedCriteria) {
            console.log(chapters);
            console.log(selectedCriteria);

            let tempTotalSelected = 0;
            selectedCriteria.criteria.forEach(({ chapter, levelAndNumbers }) => {
                levelAndNumbers.forEach(({ level, numberOfQuestions, chapterId }) => {
                    const chapter = chapters.filter(({ id }) => id === parseInt(chapterId))[0];

                    tempTotalSelected += parseInt(numberOfQuestions);
                    // if (chapter && chapter.numberOfActiveQuestions > 0) {
                    prepend({ chapterId, level: lookupLevel(level), numberOfQuestions });
                    // }
                });
            });

            setValue("totalSelected", tempTotalSelected);
        }
    }, [chapters]);

    useEffect(() => {
        if (fields && fields.length && selectedCriteria) {
            fields.forEach(data => {
                const { chapterId, id, level } = data;
                dispatch(queryAvailableQuestions({ chapter: chapterId, level, filterIndex: id }));
            });
        }
    }, [fields]);

    function onChapterChange(event, fieldId) {
        const index = $(event.target).data("index");
        let criteria = getValues(editedTest ? "criteria2" : "criteria");
        const chapter = $(event.target).val();
        const level = criteria[index].level;

        if (level) {
            dispatch(queryAvailableQuestions({ chapter, level, filterIndex: fieldId }));
        }
    }

    function onLevelChange(event, fieldId) {
        const index = $(event.target).data("index");
        let criteria = getValues(editedTest ? "criteria2" : "criteria");
        const chapter = criteria[index].chapterId;
        const level = $(event.target).val();

        if (chapter) {
            dispatch(queryAvailableQuestions({ chapter, level, filterIndex: fieldId }));
        }
    }

    const recordsPerPage = 10;
    const fetchDataByPageNumber = pageNumber => {
        setPage(pageNumber);
    };

    const handleCurrentQuestionInputChange = ({ target: { value } }) => {
        if (parseInt(value) > 0) setValue("totalSelected", value);
    };

    const handleFilterChange = () => {
        let criteria = getValues(editedTest ? "criteria2" : "criteria");
        const totalSelectedQuestion = criteria.reduce(
            (acc, { numberOfQuestions }) => acc + parseInt(numberOfQuestions) || 0,
            0
        );

        setValue("totalSelected", parseInt(totalSelectedQuestion));
    };

    console.log(errors);
    const [isChecked, setIsChecked] = React.useState(true);

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
                                    title: `${s.name} ${s.id.includes("CLC") ? "CLC" : ""} (${
                                        s.numberOfActiveQuestions
                                    })`,
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
                    <div className='w-full my-3'>
                        <Select
                            label='Chọn tiêu chí sẵn có trong 10 tiêu chí gần nhất'
                            register={register}
                            name='availabelCriteria'
                            options={userTests.map(({ subjectId, subjectName, testId }) => ({
                                title: `${subjectId} ${subjectName} ${testId}`,
                                value: testId,
                            }))}
                            additionalOption={true}
                            onChangeHandler={onCriteriaChange}
                        />
                    </div>
                    <div className='w-full'>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isChecked}
                                    onChange={() => {
                                        setIsChecked(prev => !prev);
                                    }}
                                />
                            }
                            label={
                                isChecked
                                    ? "Thu gọn tiêu chí chọn câu hỏi"
                                    : "Mở rộng tiêu chí chọn câu hỏi"
                            }
                        />{" "}
                        <Collapse in={isChecked}>
                            <ul className='w-full'>
                                <div className='uppercase flex items-center w-full justify-center text-blue-600 font-semibold'>
                                    Tiêu chí chọn câu hỏi ({fields.length}){" "}
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
                                                        errors.criteria[`${index}`].chapterId
                                                            .message
                                                    }
                                                    options={chapters
                                                        // .filter(
                                                        //     ({ numberOfActiveQuestions }) =>
                                                        //         numberOfActiveQuestions > 0
                                                        // )
                                                        .map(s => ({
                                                            title:
                                                                s.name +
                                                                ` (${s.numberOfActiveQuestions})`,
                                                            value: s.id,
                                                        }))}
                                                    index={index}
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
                                                        errors.criteria[`${index}`]
                                                            .numberOfQuestions &&
                                                        errors.criteria[`${index}`]
                                                            .numberOfQuestions.message
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
                                                        setValue(
                                                            "numberOfQuestions",
                                                            selectedNumber
                                                        );
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
                        </Collapse>
                    </div>
                </div>
            ) : (
                <div className='col-flex items-center justify-center w-full'>
                    <div className='w-full flex items-center'>
                        <div className='w-full mr-5'>
                            <Input
                                label='Tên đề thi *'
                                error={errors.testName && errors.testName.message}
                                register={register}
                                name='testName'
                            />
                            <Input register={register} name='testSubjectId' type='hidden' />
                            <Input register={register} name='testId' type='hidden' />
                        </div>
                        <div className='w-full'>
                            <Input
                                label='Môn học'
                                error={errors.testName && errors.testName.message}
                                register={register}
                                name='testSubjectName'
                                readOnly={true}
                            />
                        </div>
                    </div>
                    <div className='w-full flex items-center my-2'>
                        <div className='w-full mr-5'>
                            <Input
                                label='Số câu hỏi hiện có'
                                register={register}
                                name='totalActiveQuestions'
                                readOnly={true}
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
                    <div className='w-full'>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isChecked}
                                    onChange={() => {
                                        setIsChecked(prev => !prev);
                                    }}
                                />
                            }
                            label={
                                isChecked
                                    ? "Thu gọn tiêu chí chọn đề thi"
                                    : "Mở rộng tiêu chí chọn đề thi"
                            }
                        />
                        <Collapse in={isChecked}>
                            <ul className='w-full'>
                                <div className='uppercase flex items-center w-full justify-center text-blue-600 font-semibold'>
                                    Tiêu chí chọn đề thi ({editFields.length}){" "}
                                    <Help
                                        children={
                                            <div>
                                                <div className='text-black uppercase'>
                                                    Số lượng câu hỏi theo chương và độ khó
                                                </div>
                                                {levelOptionsLocal.map(
                                                    ({ chapterName, levelAndItsNumber }) => (
                                                        <div key={chapterName} className='px-4'>
                                                            <div className='text-left text-black'>
                                                                {chapterName}
                                                            </div>
                                                            <ul>
                                                                {levelAndItsNumber.map(value => (
                                                                    <li
                                                                        key={value}
                                                                        className='text-left ml-10 text-black'
                                                                    >
                                                                        {value}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        }
                                    />
                                </div>
                                {editFields.map((field, index) => (
                                    <li
                                        className={`mt-3 flex items-end ${
                                            errors &&
                                            errors.criteria2 &&
                                            errors.criteria2.length &&
                                            errors.criteria2[index]
                                                ? "items-center"
                                                : "items-end"
                                        }`}
                                        key={index}
                                    >
                                        <div
                                            className={`flex ${
                                                errors &&
                                                errors.criteria2 &&
                                                errors.criteria2.length
                                                    ? "items-start"
                                                    : "items-end"
                                            } w-full`}
                                        >
                                            <div className='w-full mr-3'>
                                                <Select
                                                    label='Chương'
                                                    register={register}
                                                    name={`criteria2.${index}.chapterId`}
                                                    error={
                                                        errors.criteria2 &&
                                                        errors.criteria2[`${index}`] &&
                                                        errors.criteria2[`${index}`].chapterId &&
                                                        errors.criteria2[`${index}`].chapterId
                                                            .message
                                                    }
                                                    options={editedTest.subjectChapters.map(s => ({
                                                        title:
                                                            s.name +
                                                            ` (${s.numberOfActiveQuestions})`,
                                                        value: s.id,
                                                    }))}
                                                    index={index}
                                                    onChangeHandler={e => {
                                                        onChapterChange(e, field.id);
                                                    }}
                                                />
                                            </div>
                                            <div className='w-full mr-3'>
                                                <Select
                                                    label={
                                                        <div>
                                                            Độ khó
                                                            {/* <Help helperText={}/> */}
                                                        </div>
                                                    }
                                                    register={register}
                                                    error={
                                                        errors.criteria2 &&
                                                        errors.criteria2[`${index}`] &&
                                                        errors.criteria2[`${index}`].level &&
                                                        errors.criteria2[`${index}`].level.message
                                                    }
                                                    name={`criteria2.${index}.level`}
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
                                                        errors.criteria2 &&
                                                        errors.criteria2[`${index}`] &&
                                                        errors.criteria2[`${index}`]
                                                            .numberOfQuestions &&
                                                        errors.criteria2[`${index}`]
                                                            .numberOfQuestions.message
                                                    }
                                                    name={`criteria2.${index}.numberOfQuestions`}
                                                    required
                                                    type='number'
                                                    onChangeHandler={handleFilterChange}
                                                />
                                            </div>
                                            <input
                                                type='hidden'
                                                {...register(`criteria2.${index}.fieldIndex`)}
                                                value={field.id}
                                            />
                                        </div>
                                        <div>
                                            <button
                                                type='button'
                                                className={tailwindCss.deleteOutlineButton}
                                                onClick={() => {
                                                    editRemove(index);
                                                    if (index === 0) {
                                                        dispatch(setQuestions([]));
                                                        setValue(
                                                            "numberOfQuestions",
                                                            selectedNumber
                                                        );
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
                            </ul>{" "}
                        </Collapse>
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

                                    editPrepend({
                                        chapterId: editedTest.subjectChapters[0].id,
                                        level: "",
                                        numberOfQuestions: 0,
                                    });
                                }}
                                disabled={addTestDisabled}
                            >
                                Thêm tiêu chí {editFields.length + 1}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestModalBody;
