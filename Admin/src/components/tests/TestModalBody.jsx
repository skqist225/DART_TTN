import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { chapterState, fetchAllChapters } from "../../features/chapterSlice";
import { queryAvailableQuestions, questionState } from "../../features/questionSlice";
import { clearErrorField, subjectState } from "../../features/subjectSlice";
import { setEditedTest } from "../../features/testSlice";
import TableHeader from "../utils/tables/TableHeader";
import TablePagination from "../utils/tables/TablePagination";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";
import { QuestionTableBody } from "..";
import { useDispatch } from "react-redux";
import { tailwindCss } from "../../tailwind";
import $ from "jquery";

const columns = [
    {
        name: "Mã câu hỏi",
        sortField: "id",
        // sortable: true,
    },
    {
        name: "Nội dung",
        sortField: "content",
        // sortable: true,
    },
    {
        name: "Loại câu hỏi",
        sortField: "finalAnswer",
        // sortable: true,
    },
    {
        name: "Chương",
        sortField: "chapter",
        // sortable: true,
    },
    {
        name: "Độ khó",
        sortField: "level",
        // sortable: true,
    },
    {
        name: "Giảng viên",
        sortField: "teacher",
        // sortable: true,
    },
];

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
    const [page, setPage] = useState(1);
    const { editedTest, errorObject, subjects } = useSelector(subjectState);
    const { chapters } = useSelector(chapterState);
    const { questions, totalPages, totalElements, queryAvailableQuestionsArr } =
        useSelector(questionState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (editedTest) {
            dispatch(setEditedTest(null));
        }
    };

    useEffect(() => {
        if (editedTest) {
            setValue("id", editedTest.id);
            setValue("name", editedTest.name);
        }
    }, [editedTest]);

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "criteria",
    });

    useEffect(() => {
        if (subjects && subjects.length) {
            dispatch(fetchAllChapters({ page: 0, subject: subjects[0].id }));
            setValue("testName", `Đề thi ${subjects[0].name} ${new Date().getTime()}`);
        }
    }, [subjects]);

    function onSubjectChange({ target: { value } }) {
        dispatch(fetchAllChapters({ page: 0, subject: value }));
        setValue(
            "testName",
            `Đề thi ${subjects.find(({ id }) => id === value).name} ${new Date().getTime()}`
        );
    }

    function onChapterChange(event) {
        const index = $(event.target).data("index");
        const criteria = getValues("criteria");
        const chapter = $(event.target).val();
        const level = criteria[index].level;

        if (level) {
            dispatch(queryAvailableQuestions({ chapter, level, filterIndex: index }));
        }
    }

    function onLevelChange(event) {
        const index = $(event.target).data("index");
        const criteria = getValues("criteria");
        const chapter = criteria[index].chapterId;
        const level = $(event.target).val();

        if (chapter) {
            dispatch(queryAvailableQuestions({ chapter, level, filterIndex: index }));
        }
    }
    console.log(errors);

    return (
        <div>
            <div className='col-flex items-center justify-center w-full'>
                <div className='flex items-center w-full'>
                    <div className='w-full my-5 mr-5'>
                        <Input
                            label='Tên đề thi *'
                            error={
                                (errors.name && errors.name.message) ||
                                (errorObject && errorObject.name)
                            }
                            register={register}
                            name='testName'
                            onKeyDown={onKeyDown}
                        />
                    </div>
                    <div className='my-3 w-full mr-5'>
                        <Select
                            label='Môn học *'
                            error={errors.testSubjectId && errors.testSubjectId.message}
                            register={register}
                            name='testSubjectId'
                            options={subjects.map(s => ({
                                title: `${s.name} (${s.numberOfQuestions})`,
                                value: s.id,
                            }))}
                            setValue={setValue}
                            onChangeHandler={onSubjectChange}
                            defaultValue={subjects && subjects[0] && subjects[0].id}
                        />
                    </div>
                    <div className='my-3 w-full'>
                        <Input
                            label='Số lượng câu hỏi'
                            register={register}
                            name='numberOfQuestions'
                            onKeyDown={onKeyDown}
                        />
                    </div>
                </div>
                <ul className='w-full'>
                    {fields.map((field, index) => (
                        <li className='mt-3' key={index}>
                            <div
                                className={`flex ${
                                    errors && errors.criteria && errors.criteria.length
                                        ? "items-start"
                                        : "items-end"
                                } w-full`}
                            >
                                <div className='w-full mr-3'>
                                    <Select
                                        label='Chương *'
                                        register={register}
                                        name={`criteria.${index}.chapterId`}
                                        error={
                                            errors.criteria &&
                                            errors.criteria[`${index}`] &&
                                            errors.criteria[`${index}`].chapterId &&
                                            errors.criteria[`${index}`].chapterId.message
                                        }
                                        options={chapters.map(s => ({
                                            title: s.name,
                                            value: s.id,
                                        }))}
                                        index={index}
                                        setValue={setValue}
                                        defaultValue={chapters && chapters[0] && chapters[0].id}
                                        onChangeHandler={onChapterChange}
                                    />
                                </div>
                                <div className='w-full mr-3'>
                                    <Select
                                        label='Độ khó *'
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
                                        onChangeHandler={onLevelChange}
                                    />
                                </div>
                                <div className='w-full mr-3'>
                                    <Input
                                        label={`Số lượng câu hỏi * / Hiện có ${
                                            queryAvailableQuestionsArr.length &&
                                            queryAvailableQuestionsArr[index] &&
                                            queryAvailableQuestionsArr[index]
                                        }`}
                                        register={register}
                                        error={
                                            errors.criteria &&
                                            errors.criteria[`${index}`] &&
                                            errors.criteria[`${index}`].numberOfQuestions &&
                                            errors.criteria[`${index}`].numberOfQuestions.message
                                        }
                                        name={`criteria.${index}.numberOfQuestions`}
                                        required
                                    />
                                </div>

                                <div>
                                    <button
                                        type='button'
                                        className={tailwindCss.deleteOutlineButton}
                                        onClick={() => remove(index)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className='mt-3 self-start'>
                    <button
                        type='button'
                        className='text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800'
                        onClick={() => {
                            prepend({});
                        }}
                    >
                        Thêm tiêu chí
                    </button>
                </div>
                {questions && questions.length > 0 && (
                    <div>
                        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                            <TableHeader columns={columns} />
                            <QuestionTableBody
                                rows={questions}
                                page={page}
                                addTest
                                dispatch={dispatch}
                            />
                        </table>
                        <TablePagination
                            totalElements={totalElements}
                            totalPages={totalPages}
                            setPage={setPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default TestModalBody;
