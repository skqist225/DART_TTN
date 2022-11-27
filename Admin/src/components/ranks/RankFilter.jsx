import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { creditClassState } from "../../features/creditClassSlice";
import { examState } from "../../features/examSlice";
import { subjectState } from "../../features/subjectSlice";
import { fetchAllTakeExams, takeExamState } from "../../features/takeExamSlice";
import Select from "../utils/userInputs/Select";

function QuestionsFilter() {
    const dispatch = useDispatch();
    const { filterObject } = useSelector(takeExamState);
    const { exams } = useSelector(examState);
    const { subjects } = useSelector(subjectState);
    const { creditClasses } = useSelector(creditClassState);
    const { register, handleSubmit } = useForm();

    const onSubmit = data => {};

    const handleLevelChange = event => {
        // dispatch(fetchAllTakeExams({ ...filterObject, level: event.target.value }));
    };

    const handleSubjectChange = event => {
        // dispatch(fetchAllTakeExams({ ...filterObject, subject: event.target.value }));
    };

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(onSubmit)(e);
            }}
            className='flex items-center'
        >
            <div className='mr-2 w-full flex items-center'>
                <Select
                    label='ca thi'
                    name='examFilter'
                    register={register}
                    options={exams.map(({ id, name }) => ({
                        title: name,
                        value: id,
                    }))}
                    onChangeHandler={handleLevelChange}
                    hiddenOption
                    width={"w-40"}
                />
            </div>
            <div className='mr-2 w-full flex items-center justify-start'>
                <Select
                    label='môn học'
                    name='subjectFilter'
                    register={register}
                    options={subjects.map(subject => ({
                        title: subject.name,
                        value: subject.id,
                    }))}
                    onChangeHandler={handleSubjectChange}
                    hiddenOption
                    width={"w-40"}
                />
            </div>
            <div className='mr-2 w-full flex items-center justify-start'>
                <Select
                    label='lớp tín chỉ'
                    name='examFilter'
                    register={register}
                    options={creditClasses.map(
                        ({ id, schoolYear, semester, subjectName, group }) => ({
                            title: `${schoolYear} ${semester} ${subjectName} ${group}`,
                            value: id,
                        })
                    )}
                    onChangeHandler={handleSubjectChange}
                    hiddenOption
                    width={"w-40"}
                />
            </div>
            <div>
                <button
                    type='button'
                    className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-40'
                    onClick={() => {
                        dispatch(
                            fetchAllTakeExams({
                                page: 1,
                                query: "",
                                sortField: "score",
                                sortDir: "desc",
                            })
                        );
                    }}
                >
                    Xóa bộ lọc
                </button>
            </div>
        </form>
    );
}

export default QuestionsFilter;
