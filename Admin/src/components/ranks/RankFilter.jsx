import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { creditClassState } from "../../features/creditClassSlice";
import {
    fetchAllTakeExams,
    getStudentRankingPosition,
    takeExamState,
} from "../../features/takeExamSlice";
import Select from "../utils/userInputs/Select";
import { examTypes } from "../exams/ExamModalBody";
import $ from "jquery";

function QuestionsFilter() {
    const dispatch = useDispatch();
    const { filterObject } = useSelector(takeExamState);
    const { creditClasses } = useSelector(creditClassState);
    const { register, handleSubmit, setValue } = useForm();

    const handleExamTypeChange = event => {
        dispatch(fetchAllTakeExams({ ...filterObject, examType: event.target.value }));
        dispatch(
            getStudentRankingPosition({
                creditClass: $("#creditClassFilter").val(),
                examType: event.target.value,
            })
        );
    };

    const handleCreditClassChange = event => {
        dispatch(fetchAllTakeExams({ ...filterObject, creditClass: event.target.value }));
        dispatch(
            getStudentRankingPosition({
                creditClass: event.target.value,
                examType: $("#examTypeFilter").val(),
            })
        );
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
            <div className='mr-2 w-full flex items-center justify-start'>
                <Select
                    label='lớp tín chỉ'
                    name='creditClassFilter'
                    register={register}
                    options={creditClasses.map(
                        ({ id, schoolYear, semester, subjectName, group }) => ({
                            title: `${schoolYear} ${semester} ${subjectName} ${group}`,
                            value: id,
                        })
                    )}
                    onChangeHandler={handleCreditClassChange}
                    defaultValue={creditClasses && creditClasses.length && creditClasses[0].id}
                    removeLabel={true}
                    width={"w-80"}
                />
            </div>
            <div className='mr-2 w-full flex items-center justify-start'>
                <Select
                    label='loại thi'
                    name='examTypeFilter'
                    register={register}
                    options={examTypes.map(({ title, value }) => ({
                        title,
                        value,
                    }))}
                    onChangeHandler={handleExamTypeChange}
                    defaultValue={examTypes[0].value}
                    removeLabel={true}
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
                                creditClass: creditClasses[0].id,
                                examType: "Giữa kỳ",
                            })
                        );
                        setValue("creditClassFilter", creditClasses[0].id);
                        setValue("examTypeFilter", examTypes[0].value);
                    }}
                >
                    Xóa bộ lọc
                </button>
            </div>
        </form>
    );
}

export default QuestionsFilter;
