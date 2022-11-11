import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { chapterState, fetchAllChapters } from "../../features/chapterSlice";
import { questionState } from "../../features/questionSlice";
import { clearErrorField, subjectState } from "../../features/subjectSlice";
import { setEditedTest } from "../../features/testSlice";
import TableHeader from "../utils/tables/TableHeader";
import TablePagination from "../utils/tables/TablePagination";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";
import { QuestionTableBody } from "..";

const columns = [
    {
        name: "STT",
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
        name: "Độ khó",
        sortField: "level",
        // sortable: true,
    },
    {
        name: "Chương",
        sortField: "chapter",
        // sortable: true,
    },
    {
        name: "Môn học",
        sortField: "chapter",
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

function TestModalBody({ errors, register, dispatch, setValue, control }) {
    const [page, setPage] = useState(1);
    const { editedTest, errorObject } = useSelector(subjectState);
    const { subjects } = useSelector(subjectState);
    const { chapters } = useSelector(chapterState);
    const { questions, totalPages, totalElements } = useSelector(questionState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (editedTest) {
            dispatch(setEditedTest(null));
        }
    };

    if (editedTest) {
        setValue("id", editedTest.id);
        setValue("name", editedTest.name);
    }

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "criteria",
    });

    useEffect(() => {
        if (subjects && subjects.length) {
            dispatch(fetchAllChapters({ page: 0, subject: subjects[0].id }));
        }
    }, [subjects]);

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
                            options={subjects.map(s => ({ title: s.name, value: s.id }))}
                            setValue={setValue}
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
                        <li className='flex items-center' key={index}>
                            <div className='flex items-end w-full'>
                                <div className='my-3 w-full mr-5'>
                                    <Select
                                        label='Chương'
                                        register={register}
                                        name={`criteria.${index}.chapterId`}
                                        options={chapters.map(s => ({
                                            title: s.name,
                                            value: s.id,
                                        }))}
                                        setValue={setValue}
                                    />
                                </div>
                                <div className='my-3 w-full mr-5'>
                                    <Select
                                        label='Mức độ *'
                                        register={register}
                                        name={`criteria.${index}.level`}
                                        options={levelOptions}
                                        required
                                    />
                                </div>
                                <div className='my-3 w-full'>
                                    <Input
                                        label='Số lượng câu hỏi *'
                                        register={register}
                                        name={`criteria.${index}.numberOfQuestions`}
                                        required
                                    />
                                </div>
                                <div className='mb-1 ml-2'>
                                    <button
                                        type='button'
                                        className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 '
                                        onClick={() => remove(index)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className='self-start'>
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
